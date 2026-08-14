# Qué cambió en la versión 5 y por qué

Cambios derivados de la lectura de la sesión 1 del 13 de agosto de 2026.
Cada uno responde a algo que pasó en la sesión, no a una idea de escritorio.

---

## 1. La facilitadora ya no es el único canal de captura

**Qué pasó.** Todo aporte pasó por una persona tecleando en vivo mientras facilitaba, con una
segunda persona de respaldo. El copiar y pegar del chat falló en vivo. Los nombres se
capturaron de oído. Resultado: 13 aportes de una sesión que daba para muchos más.

**Qué se hizo.** El taller ahora sincroniza en vivo sobre **Firebase**, en un proyecto
**exclusivo del taller** —separado de cualquier otro sistema, para poder entregárselo a la
Comisión sin que eso toque ninguna otra cuenta— con dos colecciones, `taller_aportes` y
`taller_estado`:

- Los participantes entran a `…/participa?sesion=N` desde su teléfono y mandan sus aportes.
- Amanda entra en modo **copiloto** y ve **el mismo tablero en vivo**: los votos, las señales
  encendidas, las banderas del expediente y las capas destapadas, además de todos los aportes.
  También captura en paralelo.
- Todo aparece **al instante**, sin refrescar y sin esperas.

Si no hay internet, el taller trabaja en modo local y sube lo pendiente en cuanto vuelve
la conexión. **Nunca se rompe la sesión.**

## 1 bis. La sesión anterior sigue viva; la nueva arranca de cero

**Qué se necesitaba.** Que el comité pudiera seguir aportando a la sesión 1 durante todo el
mes, y que al llegar a la sesión 2 el tablero estuviera completamente en blanco.

**Cómo funciona.** Cada aporte lleva grabado el número de sesión al que pertenece, y la liga
de participantes apunta a una sesión concreta (`?sesion=1`). Por eso:

- La liga de la sesión 1 sigue recibiendo casos reales después de la reunión, sin fecha de cierre.
- Al cambiar el selector a la sesión 2, el simulador, el expediente, los votos y el tablero
  están vacíos. Nada se mezcla ni se pisa.
- El bloque **El taller acumulado**, en el cierre, muestra cuántos aportes hay por sesión y el
  total, y exporta todo junto en un solo `.md` para armar las fichas.

## 2. Los aportes ahora tienen la forma de la ficha

**Qué pasó.** Lo más valioso de la sesión fueron parametrizaciones concretas —altas en misma
geolocalización en menos de una hora, más de 90 cuentas en un minuto como firma de bot, cinco o
más claves por cuenta al mes, depósitos por transferencia contados por día— y todas cayeron en
un campo de texto libre.

**Qué se hizo.** El formulario de aporte pide **variable, umbral y ventana** por separado, más
institución, quién lo aporta (con lista del padrón para que la atribución sea confiable) y si lo
detecta el sistema o el analista. La exportación en PDF y en Markdown ya sale con esa estructura:
es un borrador de ficha, no notas en bruto.

## 3. El micrositio soporta varias sesiones

**Qué pasó.** El estado se guardaba en una sola clave, `amsofipo_taller_s1`. La sesión 2 habría
borrado a la sesión 1.

**Qué se hizo.** Estado por sesión, selector en el encabezado, y un catálogo de tipologías y de
sesiones al inicio del código: agregar una sesión es llenar una entrada, no programar.
Las **propuestas a la UIF se acumulan entre todas las sesiones** y no se borran.

## 4. Contenido de la sesión 2

Las dos tipologías que el comité votó, cada una con su herramienta:

- **Crédito con pago anticipado atípico** — línea de vida del crédito con 7 momentos y medidores
  de porcentaje del plazo, porcentaje prepagado y origen documentado. El punto pedagógico: el
  prepago no es sospechoso; lo es quién paga, con qué y en qué momento del plazo.
- **Beneficiario controlador oculto** — estructura de propiedad en 5 capas que termina en una
  persona con 0% del capital y control de hecho. El punto: el 25% es un umbral, no la definición.

Más el apartado de **listas y jurisdicciones** que pidió la Comisión, con un asistente de
coincidencias que cruza lista × tipo de coincidencia × momento de detección y devuelve qué
procede y qué se documenta.

## 5. Correcciones al expediente de empresas fachada

- El domicilio ahora **incluye en pantalla** los datos con los que se explica la bandera (oficina
  virtual, repetición en otras altas y plaza), que antes se explicaban con información que el
  expediente no mostraba.
- Se incorporaron las banderas que aportó el comité: el objeto social paraguas que puede encubrir
  una actividad vulnerable, la denominación genérica sin relación con lo declarado, y la
  incongruencia entre domicilio y actividad.

## 6. Tiempos rebalanceados

Medidos contra la transcripción: apertura y metodología se llevaron 8 minutos de los 15 planeados,
cuentas mula se llevó **26 de 18**, empresas fachada 14 de 18, y el reto con IA no se ejecutó.

La sesión 2 asigna 3 / 4 / 20 / 14 / 8 / 8 / 3 y mete el reto con IA como bloque con hora propia,
no como herramienta de reserva.

---

## Candados de costo y de acceso en la función de IA

**El problema no era el costo, era el endpoint abierto.** La versión anterior aceptaba texto sin
límite de longitud, desde cualquier origen y sin límite de frecuencia.

| Antes | Ahora |
|---|---|
| `claude-sonnet-4-5`, con retiro anunciado para no antes del 29 de septiembre de 2026 | `claude-sonnet-5`, más nuevo y más barato, configurable con `CLAUDE_MODEL` y con lista de respaldo |
| Sin máximo de caracteres | Tope de 4,000 caracteres |
| `max_tokens` 1500 | 900, suficiente para el JSON con narrativa de 6 renglones |
| Sin tiempo límite | 25 segundos con `AbortController` |
| `access-control-allow-origin: *` | Solo el propio sitio, o lo que diga `ORIGENES_PERMITIDOS` |
| Sin límite de frecuencia | 12 análisis por IP cada 5 minutos |
| Sin autenticación | Encabezado `x-taller` si se configura `CODIGO_TALLER` |
| Errores genéricos | Mensajes específicos: sin key, sin saldo, modelo retirado, tiempo agotado |

**Costo con este uso:** menos de un centavo de dólar por análisis. Una sesión con reto en vivo
para 20 instituciones cuesta alrededor de 0.40 USD; un año completo de trabajo del comité,
alrededor de 18 USD.

Recomendación: registrar tarjeta con **tope mensual de 20 USD y alerta por correo** en la consola,
en lugar de dejar saldo suelto que se agota a media sesión.

## Otras correcciones técnicas

- **Escapado de HTML.** La respuesta del modelo y el texto de los aportes se insertaban sin
  escapar. Era el mismo defecto que ya se había corregido en el micrositio de tipologías 360educa.
  Con captura solo de la facilitadora el riesgo era bajo; con participantes enviando texto, no.
- **Endpoint `/api/salud`** que reporta en español el estado del despliegue antes de cada sesión.
- **Encabezados de seguridad** adicionales en `netlify.toml`.
- **Guía de anonimización** visible en los dos formularios de captura.
- **Reglas de Firebase** en `REGLAS-FIREBASE.txt`: acceso anónimo obligatorio, validación de
  forma y tamaño de cada aporte, sin borrados desde el navegador, y cierre por omisión de
  cualquier colección no declarada.
- **Configuración fuera del código.** La conexión a la base vive en `config-firebase.js`, un
  archivo de seis líneas. Cambiar de proyecto es pegar un bloque ahí y nada más.
- **Guía de instalación** en `CONFIGURAR-FIREBASE.md`, clic por clic, incluido cómo transferir
  el proyecto a AMSOFIPO cuando corresponda y por qué conviene dejarlo en el plan gratuito.

## Revisión anual obligatoria

Los modelos de IA tienen fecha de retiro. Esta versión lee el modelo de una variable de entorno
y trae lista de respaldo, pero **la revisión anual del despliegue sigue siendo necesaria**.
Calendario: <https://platform.claude.com/docs/en/about-claude/model-deprecations>
