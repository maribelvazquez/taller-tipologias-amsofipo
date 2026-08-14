# Taller de Tipologías — AMSOFIPO · Comisión de PLD

Micrositio del taller de tipologías de financiamiento ilícito en SOFIPOS.
Modalidad remota, 60 minutos por sesión, con captura en vivo de los aportes del comité.

**Versión 4.0** — deja de ser material de una sola sesión y pasa a ser la herramienta
permanente de la Comisión: soporta varias sesiones sin pisarse, recibe aportes de los
participantes desde su propio dispositivo y acumula las propuestas para la UIF.

---

## Qué trae

### Sesión 1 — cuentas mula y empresas fachada

| Bloque | Tiempo | Herramienta |
|---|---|---|
| 1 · Apertura y encuadre | 4 min | Qué está en juego + la ventana ante la UIF |
| 2 · Metodología del manual | 6 min | Termómetro de prioridad con 15 tipologías votables |
| 3 · Cuentas mula | 25 min | Simulador de red: 8 señales que revelan el anillo |
| 4 · Empresas fachada | 15 min | Expediente vivo: alta de persona moral con 7 banderas |
| 5 · Cierre | 10 min | Tablero de aportes y exportación del insumo |

### Sesión 2 — crédito con prepago atípico y beneficiario controlador oculto

| Bloque | Tiempo | Herramienta |
|---|---|---|
| 1 · Apertura y encuadre | 3 min | Recuento de la sesión 1 |
| 2 · Metodología | 4 min | Termómetro (acumula votos de la sesión) |
| 3 · Crédito con pago anticipado atípico | 20 min | **Línea de vida del crédito**: 7 momentos, 5 banderas, medidores de plazo, prepago y origen |
| 4 · Beneficiario controlador oculto | 14 min | **Estructura en capas**: 5 niveles de propiedad hasta el control de hecho |
| ★ Listas y jurisdicciones | 8 min | **Asistente de coincidencias**: lista × tipo × momento → ruta de atención |
| ✦ Reto con IA | 8 min | Modo duelo, el que quedó pendiente en la sesión 1 |
| 5 · Cierre | 3 min | Tablero y exportación |

### Transversales, disponibles siempre

- **⚡ Generador de casos** — motor de reglas que arma situaciones nuevas y desglosa el peso de cada factor.
- **▲ Propuestas a la UIF** — lista viva que **no se borra entre sesiones**. Es el entregable final del ejercicio.

Cronómetro de 60 minutos segmentado por bloque, que se reconfigura según la sesión elegida.
Navegación con la barra lateral o con las teclas `0`–`9`.

---

## Cómo correrlo

### Opción A — sin nada (para ensayar)

Descarga el repo y abre `index.html` con doble clic. Funciona completo: el analizador cae a su
**motor de reglas local** de 32 patrones cuando no hay función de IA disponible, y el taller
trabaja en **modo local** sin sala compartida. No requiere internet, ni cuenta, ni costo.

### Opción B — publicado en Netlify

1. Sube este repositorio a GitHub.
2. En Netlify: **Add new site → Import an existing project** y elige el repo.
   No hay build; *publish directory* es la raíz (`.`).
3. En **Site configuration → Environment variables**:

   | Variable | Obligatoria | Para qué |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | para la IA | Se obtiene en <https://console.anthropic.com> → *API Keys* |
   | `CLAUDE_MODEL` | no | Cambiar de modelo sin tocar código. Por omisión `claude-sonnet-5` |
   | `CODIGO_TALLER` | recomendada | Si está puesta, el analizador solo atiende peticiones con ese código. Evita que un tercero consuma el saldo |
   | `ORIGENES_PERMITIDOS` | no | Lista de orígenes autorizados separados por comas. Por omisión solo el propio sitio |
   | `LLAVE_FACILITADOR` | no | Permite borrar una sala desde la API |

4. Deploy. Nada más.

Antes de cada sesión, abre **`/api/salud`**: dice en español si la key está puesta, si es válida,
qué modelo está configurado, si ese modelo responde y si la sala compartida está lista.

---

## La sala compartida

Resuelve el cuello de botella de la sesión 1: que todo aporte tuviera que pasar por la facilitadora
tecleando en vivo.

1. La facilitadora abre **⚙ Sala** en el encabezado, pone un código (por ejemplo `AMSOFIPO-S2`) y
   elige el modo **Facilitador**.
2. La portada muestra la liga `…/participa?sala=AMSOFIPO-S2` y el código en grande, para dictarlo.
3. Los participantes abren esa liga desde su teléfono o computadora y mandan sus aportes con campos
   estructurados: variable, umbral, ventana, institución y si lo detecta el sistema o el analista.
4. Un segundo capturista (modo **Copiloto**) puede entrar a la misma sala y capturar en paralelo.
5. Todo aparece en el tablero de cierre de la facilitadora en menos de siete segundos.

Si la sala no está disponible, **nada se rompe**: el taller sigue en modo local exactamente como antes.

La liga de participantes también sirve **entre sesiones**. Es la vía para cumplir el compromiso de
un caso real anonimizado por tipología antes de cada sesión.

---

## Estructura

```
index.html                        micrositio del taller (HTML + CSS + JS en un archivo)
participa.html                    formulario de aportes para los participantes
herramientas.html                 hub con las tres herramientas de la Comisión
netlify/functions/analizar.mjs    analizador con IA, con topes de costo y candados de acceso
netlify/functions/sala.mjs        sala compartida (Netlify Blobs)
netlify/functions/salud.mjs       diagnóstico en español del despliegue
netlify.toml                      configuración de despliegue y rutas
package.json                      dependencia de @netlify/blobs
assets/logo-amsofipo.png          logo institucional
GUION-FACILITADOR.md              guion de uso interno, no se proyecta
LEEME-v4.md                       qué cambió en esta versión y por qué
ESTRUCTURA-DRIVE.md               árbol de carpetas propuesto para el repositorio del comité
```

## Identidad

| | |
|---|---|
| Morado institucional | `#6F2693` |
| Magenta de acento | `#A539A2` |
| Degradado de encabezado | `#301457` → `#210E3A` |

## Notas de contenido

Los bloques incorporan material del documento *Riesgos de Lavado de Dinero y Fiscalización en las
SOFIPOs* —pitufeo, efecto cuenta puente, cuentas concentradoras, artículo 69-B del CFF, beneficiario
controlador y abuso de factoraje y arrendamiento financiero en instituciones de nivel II a IV— y los
aportes del comité recogidos en la sesión 1.

Ningún caso, expediente o situación del micrositio corresponde a una institución, cliente u operación real.
