/**
 * Diagnóstico en español del despliegue. Se abre en /api/salud antes de cada sesión.
 * Responde si la API key está puesta, si es válida, qué modelo está configurado,
 * si ese modelo responde y si la sala compartida está disponible.
 *
 * No expone la API key ni ningún dato de la sesión.
 */

export default async () => {
  const r = {
    revisado: new Date().toISOString(),
    apiKey: { puesta: false, valida: null, nota: "" },
    modelo: { configurado: process.env.CLAUDE_MODEL || "claude-sonnet-5 (por omisión)", responde: null, nota: "" },
    sala: { motor: "Firestore (social-tracker360)", nota: "La sala vive en Firestore, no en Netlify: se revisa desde el propio micrositio con ⚙ Sala → Probar conexión." },
    candados: {
      codigoTaller: !!process.env.CODIGO_TALLER,
      origenesPermitidos: process.env.ORIGENES_PERMITIDOS || "(solo el propio sitio)",

    },
    veredicto: "",
  };

  const key = process.env.ANTHROPIC_API_KEY;
  r.apiKey.puesta = !!key;
  if (!key) {
    r.apiKey.nota = "Falta ANTHROPIC_API_KEY en Netlify. El taller funciona igual con el motor de reglas local.";
  } else {
    const modelo = process.env.CLAUDE_MODEL || "claude-sonnet-5";
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelo,
          max_tokens: 8,
          messages: [{ role: "user", content: "ok" }],
        }),
      });
      if (resp.ok) {
        r.apiKey.valida = true;
        r.modelo.responde = true;
        r.modelo.nota = "El modelo respondió correctamente.";
      } else {
        const t = await resp.text();
        r.apiKey.valida = resp.status !== 401;
        r.modelo.responde = false;
        if (resp.status === 401) r.apiKey.nota = "La API key no es válida o fue revocada.";
        else if (/credit|balance/i.test(t)) r.apiKey.nota = "La cuenta se quedó sin saldo.";
        else if (resp.status === 404 || /model/i.test(t))
          r.modelo.nota = "El modelo configurado no existe o fue retirado. Cambia la variable CLAUDE_MODEL.";
        else r.modelo.nota = "La API respondió " + resp.status + ".";
      }
    } catch (e) {
      r.modelo.responde = false;
      r.modelo.nota = "No se pudo contactar la API: " + String(e).slice(0, 150);
    }
  }

  r.veredicto = r.modelo.responde
    ? "Todo listo para la sesión."
    : r.apiKey.puesta
      ? "El analizador con IA no responde; la sesión corre con el motor de reglas local y no se nota."
      : "Sin IA configurada; la sesión corre con el motor de reglas local y no se nota.";

  return new Response(JSON.stringify(r, null, 2), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};

export const config = { path: "/api/salud" };
