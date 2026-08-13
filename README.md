# Taller de Tipologías — AMSOFIPO · Comisión de PLD

Micrositio interactivo para la **Sesión 1** del taller de tipologías de financiamiento
ilícito en SOFIPOS. Modalidad remota, 60 minutos.

Todo el micrositio es **un solo archivo** (`index.html`) sin dependencias externas:
funciona abriéndolo con doble clic, sin servidor y sin internet.

---

## Qué trae

| Bloque | Tiempo | Herramienta |
|---|---|---|
| 1 · Apertura y encuadre | 5 min | Qué está en juego (sanciones CNBV/penales) + la ventana ante la UIF |
| 2 · Metodología del manual | 10 min | Termómetro de prioridad: 14 tipologías votables con ranking en vivo |
| 3 · Cuentas mula | 18 min | Simulador de red: 6 señales que revelan el anillo |
| 4 · Empresas fachada | 18 min | Expediente vivo: alta de persona moral con 7 banderas ocultas |
| ⚡ Generador de casos | transversal | Motor de reglas que arma casos nuevos y califica con el peso de cada factor |
| ✦ Reto con IA | transversal | Los oficiales redactan su caso y reciben análisis + borrador de narrativa |
| 5 · Cierre | 9 min | Tablero de aportes y exportación del insumo del manual |

Cronómetro de 60 minutos segmentado por bloque en la barra superior.
Navegación con la barra lateral o con las teclas `0`–`7`.

---

## Cómo correrlo

### Opción A — sin nada (para ensayar)

Descarga el repo y abre `index.html` con doble clic. Funciona completo:
el analizador cae a su **motor de reglas local** de ~29 patrones cuando no hay
función de IA disponible. No requiere internet, ni cuenta, ni costo.

### Opción B — publicado en Netlify (con IA)

1. Sube este repositorio a GitHub.
2. En Netlify: **Add new site → Import an existing project** y elige el repo.
   No hay build: *publish directory* es la raíz (`.`).
3. En **Site configuration → Environment variables**, agrega:

   ```
   ANTHROPIC_API_KEY = sk-ant-...
   ```

   Se obtiene en <https://console.anthropic.com> → *API Keys*.
4. Deploy. El micrositio llamará a `/.netlify/functions/analizar`.

Si la variable no está configurada, la función responde `501` y el micrositio
usa el motor local sin que se note en la sesión. **La IA es un extra, no un requisito.**

---

## Estructura

```
index.html                        micrositio completo (HTML + CSS + JS en un archivo)
netlify/functions/analizar.mjs    función serverless que llama a la API de Claude
netlify.toml                      configuración de despliegue
assets/logo-amsofipo.png          logo institucional
```

## Identidad

Colores tomados del logo y del sitio de AMSOFIPO:

| | |
|---|---|
| Morado institucional | `#6F2693` |
| Magenta de acento | `#A539A2` |
| Degradado de encabezado | `#301457` → `#210E3A` |
| Fondo | negro `#07040C` |

## Notas de contenido

Los bloques 3 y 4 incorporan material del documento *Riesgos de Lavado de Dinero y
Fiscalización en las SOFIPOs*: pitufeo, efecto cuenta puente, cuentas concentradoras,
artículo 69-B del CFF, beneficiario controlador y abuso de factoraje y arrendamiento
financiero en instituciones de nivel II a IV.

Ningún caso del micrositio corresponde a una institución o cliente real.
