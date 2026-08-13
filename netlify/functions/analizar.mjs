/**
 * Analizador de situaciones de riesgo — Taller de Tipologías AMSOFIPO
 *
 * Recibe { texto } y devuelve el análisis estructurado que el micrositio pinta:
 *   { clasificacion, plazo, tipologias:[{nombre,peso}], senales:[{texto,peso}], narrativa }
 *
 * Requiere la variable de entorno ANTHROPIC_API_KEY en Netlify.
 * Si no está configurada, responde 501 y el micrositio cae solo a su motor de reglas local.
 */

const MODELO = "claude-sonnet-4-5";

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
  "narrativa": "borrador de narrativa para el reporte: qué se observó, cómo se detectó, qué verificó la institución y por qué se clasifica así. 4 a 6 renglones."
}

Reglas:
- Las señales deben ser observables, no interpretaciones.
- Si el comportamiento no encaja en ninguna tipología conocida del sector, devuelve "tipologias": []
  y dilo en la narrativa: es candidata a proponer ante la UIF.
- Si se trata de una tentativa (la operación no se concretó), señálalo explícitamente:
  no eliminar la obligación de análisis y, en su caso, de reporte.
- No inventes datos que no estén en la descripción.
- Español de México, tono técnico y breve.`;

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (req.method !== "POST") {
    return json({ error: "Usa POST" }, 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: "ANTHROPIC_API_KEY no configurada en Netlify" }, 501);
  }

  let texto = "";
  try {
    const body = await req.json();
    texto = (body.texto || body.text || "").toString().trim();
  } catch {
    return json({ error: "Cuerpo inválido" }, 400);
  }
  if (texto.length < 20) {
    return json({ error: "Describe la situación con un poco más de detalle." }, 400);
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 1500,
        system: INSTRUCCIONES,
        messages: [{ role: "user", content: texto }],
      }),
    });

    if (!r.ok) {
      const detalle = await r.text();
      return json({ error: "La API respondió " + r.status, detalle: detalle.slice(0, 400) }, 502);
    }

    const data = await r.json();
    const salida = (data.content || []).map((b) => b.text || "").join("").trim();
    const limpio = salida.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    try {
      return json(JSON.parse(limpio), 200);
    } catch {
      // Si el modelo no devolvió JSON, se entrega como texto y el micrositio lo muestra igual.
      return json({ analisis: salida }, 200);
    }
  } catch (e) {
    return json({ error: "Falló la llamada a la API", detalle: String(e).slice(0, 300) }, 502);
  }
};

function cors() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  };
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: cors() });
}

export const config = { path: "/api/analizar" };
