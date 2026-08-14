/**
 * Analizador de situaciones de riesgo — Taller de Tipologías AMSOFIPO
 *
 * Recibe { texto } y devuelve el análisis estructurado que el micrositio pinta:
 *   { clasificacion, plazo, tipologias:[{nombre,peso}], senales:[{texto,peso}], narrativa }
 *
 * Variables de entorno (Netlify → Site configuration → Environment variables):
 *   ANTHROPIC_API_KEY   obligatoria. Sin ella la función responde 501 y el micrositio
 *                       cae solo a su motor de reglas local, sin que se note en la sesión.
 *   CLAUDE_MODEL        opcional. Permite cambiar de modelo sin tocar código.
 *                       Por omisión: claude-sonnet-5.
 *   CODIGO_TALLER       opcional pero recomendada. Si está puesta, la función solo
 *                       atiende peticiones que traigan el encabezado x-taller con ese
 *                       valor. Evita que un tercero consuma el saldo de la API.
 *   ORIGENES_PERMITIDOS opcional. Lista separada por comas de orígenes autorizados.
 *                       Por omisión solo se permite el propio sitio (misma URL).
 *
 * Candados de costo — ver LEEME-v4.md:
 *   · Tope de 4,000 caracteres de entrada (antes no había máximo: una sola petición
 *     con un cuerpo enorme podía costar cientos de veces lo normal).
 *   · max_tokens de 900, suficiente para el JSON con narrativa de 6 renglones.
 *   · Tiempo límite de 25 segundos para que la función no se quede colgada.
 *   · Límite de frecuencia por IP, best-effort dentro de la instancia.
 */

const MODELO_POR_OMISION = "claude-sonnet-5";
// Respaldos por si el modelo configurado ya no existe. El primero que responda, gana.
const RESPALDOS = ["claude-sonnet-5", "claude-haiku-4-5"];

const MAX_CARACTERES = 4000;
const MIN_CARACTERES = 20;
const MAX_TOKENS = 900;
const TIMEOUT_MS = 25000;

// Límite de frecuencia: 12 análisis por IP cada 5 minutos. Un taller normal usa 3 o 4.
const VENTANA_MS = 5 * 60 * 1000;
const MAX_POR_VENTANA = 12;
const visitas = new Map();

const INSTRUCCIONES = `Eres analista de prevención de lavado de dinero especializado en el sector
de Sociedades Financieras Populares (SOFIPOS) en México, apoyando a la Comisión de PLD de AMSOFIPO
en la construcción de su manual de tipologías.

Recibirás la descripción de un comportamiento observado, redactada por un oficial de cumplimiento.
Analízala y responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, con esta forma:

{
  "clasificacion": "No reportable · seguimiento documentado" | "Operación inusual" | "Operación inusual con elementos de preocupante",
  "plazo": "una frase con el plazo o la acción que corresponde",
  "tipologias": [{"nombre": "nombre de la tipología", "peso": 1-10}],
  "senales": [{"texto": "señal de alerta observable", "peso": 1-5}],
  "parametro": {"variable": "qué se mide", "umbral": "valor o condición", "ventana": "periodo de observación"},
  "narrativa": "borrador de narrativa para el reporte: qué se observó, cómo se detectó, qué verificó la institución y por qué se clasifica así. 4 a 6 renglones."
}

Reglas:
- Las señales deben ser observables, no interpretaciones.
- En "parametro" propón cómo parametrizaría el alertamiento en un sistema de monitoreo:
  qué variable, con qué umbral y en qué ventana de tiempo. Si no aplica, devuélvelo en null.
- Si el comportamiento no encaja en ninguna tipología conocida del sector, devuelve "tipologias": []
  y dilo en la narrativa: es candidata a proponer ante la UIF.
- Si se trata de una tentativa (la operación no se concretó), señálalo explícitamente:
  no elimina la obligación de análisis y, en su caso, de reporte.
- No inventes datos que no estén en la descripción.
- Español de México, tono técnico y breve.`;

export default async (req) => {
  const origen = req.headers.get("origin") || "";
  const permitido = origenPermitido(origen, req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(permitido ? origen : "") });
  }
  if (req.method !== "POST") {
    return json({ error: "Usa POST" }, 405, origen);
  }
  if (origen && !permitido) {
    return json({ error: "Origen no autorizado para este analizador." }, 403, origen);
  }

  // Código del taller (si está configurado)
  const codigoEsperado = process.env.CODIGO_TALLER;
  if (codigoEsperado && req.headers.get("x-taller") !== codigoEsperado) {
    return json({ error: "Falta el código del taller o no coincide." }, 401, origen);
  }

  // Límite de frecuencia por IP
  const ip =
    (req.headers.get("x-nf-client-connection-ip") ||
      (req.headers.get("x-forwarded-for") || "").split(",")[0] ||
      "desconocida").trim();
  if (excedeLimite(ip)) {
    return json(
      { error: "Demasiados análisis seguidos desde esta conexión. Espera unos minutos." },
      429,
      origen
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: "ANTHROPIC_API_KEY no configurada en Netlify" }, 501, origen);
  }

  let texto = "";
  try {
    const body = await req.json();
    texto = (body.texto || body.text || "").toString().trim();
  } catch {
    return json({ error: "Cuerpo inválido" }, 400, origen);
  }
  if (texto.length < MIN_CARACTERES) {
    return json({ error: "Describe la situación con un poco más de detalle." }, 400, origen);
  }
  if (texto.length > MAX_CARACTERES) {
    texto = texto.slice(0, MAX_CARACTERES);
  }

  const modelos = [process.env.CLAUDE_MODEL || MODELO_POR_OMISION, ...RESPALDOS].filter(
    (m, i, a) => m && a.indexOf(m) === i
  );

  let ultimoError = null;
  for (const modelo of modelos) {
    const r = await llamar(apiKey, modelo, texto);
    if (r.ok) return json(r.datos, 200, origen);
    ultimoError = r;
    // Solo vale la pena intentar con el siguiente modelo si el problema fue el modelo.
    if (!r.modeloInvalido) break;
  }

  return json(
    {
      error: mensajeDeError(ultimoError),
      detalle: (ultimoError && ultimoError.detalle) || "",
    },
    502,
    origen
  );
};

async function llamar(apiKey, modelo, texto) {
  const ctrl = new AbortController();
  const reloj = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelo,
        max_tokens: MAX_TOKENS,
        system: INSTRUCCIONES,
        messages: [{ role: "user", content: texto }],
      }),
    });

    if (!r.ok) {
      const detalle = await r.text();
      return {
        ok: false,
        status: r.status,
        detalle: detalle.slice(0, 400),
        modeloInvalido: r.status === 404 || /model/i.test(detalle),
        saldo: r.status === 400 && /credit|balance/i.test(detalle),
      };
    }

    const data = await r.json();
    const salida = (data.content || []).map((b) => b.text || "").join("").trim();
    const limpio = salida.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
      return { ok: true, datos: { ...JSON.parse(limpio), modelo } };
    } catch {
      return { ok: true, datos: { analisis: salida, modelo } };
    }
  } catch (e) {
    const abortado = String(e).includes("abort");
    return {
      ok: false,
      status: abortado ? 504 : 502,
      detalle: String(e).slice(0, 300),
      abortado,
      modeloInvalido: false,
    };
  } finally {
    clearTimeout(reloj);
  }
}

function mensajeDeError(e) {
  if (!e) return "No se pudo contactar la API.";
  if (e.abortado) return "La API tardó más de 25 segundos. Vuelve a intentarlo.";
  if (e.status === 401) return "La API key no es válida o fue revocada.";
  if (e.saldo) return "La cuenta de la API se quedó sin saldo.";
  if (e.modeloInvalido) return "El modelo configurado ya no existe. Revisa la variable CLAUDE_MODEL.";
  return "La API respondió " + (e.status || "error");
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

function origenPermitido(origen, req) {
  if (!origen) return true; // llamada del mismo sitio o herramienta local
  const lista = (process.env.ORIGENES_PERMITIDOS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (lista.length) return lista.some((o) => origen === o || origen.endsWith(o));
  try {
    return new URL(origen).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

function cors(origen) {
  const h = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-headers": "content-type, x-taller",
    "access-control-allow-methods": "POST, OPTIONS",
    vary: "Origin",
  };
  if (origen) h["access-control-allow-origin"] = origen;
  return h;
}
function json(obj, status, origen) {
  return new Response(JSON.stringify(obj), { status, headers: cors(origen || "") });
}

export const config = { path: "/api/analizar" };
