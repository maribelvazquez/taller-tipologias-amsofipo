/**
 * Sala compartida del taller — captura en vivo entre facilitador, copiloto y participantes.
 *
 * Resuelve tres cosas de una sola vez:
 *   1. Que la facilitadora deje de ser el único canal de captura (modo copiloto).
 *   2. Que los participantes puedan mandar sus propios aportes y casos reales desde su liga.
 *   3. Que el trabajo de la sesión no viva solamente en el navegador de una persona.
 *
 * Usa Netlify Blobs, que no requiere configuración ni costo adicional.
 * Si Blobs no está disponible, la función responde 503 y el micrositio sigue
 * trabajando en modo local, exactamente igual que hoy. Nunca rompe la sesión.
 *
 * Rutas (todas bajo /api/sala):
 *   GET  /api/sala?codigo=XXXX[&desde=N]   → estado + aportes (o solo los nuevos desde N)
 *   POST /api/sala  {op:'aporte',  codigo, aporte}   → agrega un aporte (participantes y copiloto)
 *   POST /api/sala  {op:'estado',  codigo, estado}   → guarda el estado del facilitador
 *   POST /api/sala  {op:'borrar',  codigo, llave}    → limpia la sala (requiere LLAVE_FACILITADOR)
 *
 * Cada aporte se guarda como su propio objeto, no dentro de una lista compartida:
 * así dos personas capturando al mismo tiempo nunca se pisan.
 */

const MAX_TEXTO = 2000;
const MAX_APORTES = 600;

// Límite de frecuencia por IP: 40 escrituras cada 5 minutos.
const VENTANA_MS = 5 * 60 * 1000;
const MAX_POR_VENTANA = 40;
const visitas = new Map();

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });

  let store;
  try {
    const { getStore } = await import("@netlify/blobs");
    store = getStore({ name: "taller-amsofipo", consistency: "strong" });
  } catch (e) {
    return json(
      { error: "La sala compartida no está disponible en este despliegue.", detalle: String(e).slice(0, 200) },
      503
    );
  }

  try {
    if (req.method === "GET") return await leer(req, store);
    if (req.method === "POST") return await escribir(req, store);
    return json({ error: "Método no soportado" }, 405);
  } catch (e) {
    return json({ error: "Error en la sala", detalle: String(e).slice(0, 300) }, 500);
  }
};

/* ---------- lectura ---------- */

async function leer(req, store) {
  const url = new URL(req.url);
  const codigo = normalizaCodigo(url.searchParams.get("codigo"));
  if (!codigo) return json({ error: "Falta el código de sala." }, 400);

  const desde = Number(url.searchParams.get("desde") || 0) || 0;

  const estado = await store.get(`estado/${codigo}`, { type: "json" }).catch(() => null);

  const { blobs } = await store.list({ prefix: `aportes/${codigo}/` });
  const claves = blobs.map((b) => b.key).sort();
  const nuevas = claves.slice(desde);

  const aportes = [];
  for (const k of nuevas) {
    const a = await store.get(k, { type: "json" }).catch(() => null);
    if (a) aportes.push(a);
  }

  return json({
    ok: true,
    codigo,
    total: claves.length,
    desde,
    aportes,
    estado: estado || null,
  });
}

/* ---------- escritura ---------- */

async function escribir(req, store) {
  const ip = ipDe(req);
  if (excedeLimite(ip)) return json({ error: "Demasiadas capturas seguidas. Espera un momento." }, 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Cuerpo inválido" }, 400);
  }

  const codigo = normalizaCodigo(body.codigo);
  if (!codigo) return json({ error: "Falta el código de sala." }, 400);

  if (body.op === "estado") {
    const estado = body.estado && typeof body.estado === "object" ? body.estado : null;
    if (!estado) return json({ error: "Estado inválido" }, 400);
    await store.setJSON(`estado/${codigo}`, { ...estado, actualizado: new Date().toISOString() });
    return json({ ok: true });
  }

  if (body.op === "borrar") {
    const llave = process.env.LLAVE_FACILITADOR;
    if (!llave || body.llave !== llave) return json({ error: "Llave del facilitador incorrecta." }, 401);
    const { blobs } = await store.list({ prefix: `aportes/${codigo}/` });
    for (const b of blobs) await store.delete(b.key).catch(() => {});
    await store.delete(`estado/${codigo}`).catch(() => {});
    return json({ ok: true, borrados: blobs.length });
  }

  if (body.op === "aporte") {
    const a = saneaAporte(body.aporte);
    if (!a) return json({ error: "El aporte viene vacío." }, 400);

    const { blobs } = await store.list({ prefix: `aportes/${codigo}/` });
    if (blobs.length >= MAX_APORTES) return json({ error: "La sala llegó a su límite de aportes." }, 409);

    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(`aportes/${codigo}/${id}`, { ...a, id });
    return json({ ok: true, id, total: blobs.length + 1 });
  }

  return json({ error: "Operación no reconocida." }, 400);
}

/* ---------- saneamiento ---------- */

function saneaAporte(a) {
  if (!a || typeof a !== "object") return null;
  const t = (v, max = 220) => String(v == null ? "" : v).trim().slice(0, max);
  const texto = t(a.texto, MAX_TEXTO);
  if (!texto) return null;
  return {
    cid: t(a.cid, 40),
    sesion: t(a.sesion, 20),
    tip: t(a.tip, 120),
    campo: t(a.campo, 120),
    texto,
    variable: t(a.variable),
    umbral: t(a.umbral),
    ventana: t(a.ventana),
    deteccion: t(a.deteccion, 60),
    quien: t(a.quien, 120),
    institucion: t(a.institucion, 120),
    origen: t(a.origen, 40) || "participante",
    hora: t(a.hora, 20) || new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    fecha: new Date().toISOString(),
  };
}

function normalizaCodigo(c) {
  const s = String(c || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return s.length >= 3 && s.length <= 24 ? s : "";
}

function ipDe(req) {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0] ||
    "desconocida"
  ).trim();
}

function excedeLimite(ip) {
  const ahora = Date.now();
  const previas = (visitas.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  previas.push(ahora);
  visitas.set(ip, previas);
  if (visitas.size > 500) {
    for (const [k, v] of visitas) if (!v.length || ahora - v[v.length - 1] > VENTANA_MS) visitas.delete(k);
  }
  return previas.length > MAX_POR_VENTANA;
}

function cors() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET, POST, OPTIONS",
  };
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: cors() });
}

export const config = { path: "/api/sala" };
