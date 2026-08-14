# Repositorio del Manual de Tipologías — estructura de carpetas

Propuesta para el Drive (o el proyecto de Zoom) de la Comisión de PLD de AMSOFIPO.

El criterio es uno solo: **que cualquier oficial de cumplimiento que entre por primera vez
encuentre lo que busca sin preguntar**. Por eso las carpetas están numeradas —el orden importa
más que el alfabeto— y cada una lleva su propio `LEEME.txt` con dos renglones que expliquen
qué va ahí y qué no.

---

## Árbol

```
MANUAL DE TIPOLOGÍAS — COMISIÓN DE PLD
│
├── 00 · EMPIEZA AQUÍ
│   ├── LEEME — cómo funciona este repositorio.docx
│   ├── Ligas de las herramientas.txt
│   └── Calendario de sesiones 2026.xlsx
│
├── 01 · MANUAL (documento vivo)
│   ├── Manual de tipologías SOFIPOS — versión vigente.docx
│   ├── Plantilla de ficha por tipología.docx
│   └── Versiones anteriores/
│
├── 02 · FICHAS POR TIPOLOGÍA
│   ├── 01 Cuentas mula/
│   ├── 02 Empresas fachada/
│   ├── 03 Crédito con pago anticipado atípico/
│   ├── 04 Beneficiario controlador oculto/
│   └── _Plantilla/
│
├── 03 · CASOS APORTADOS POR LAS INSTITUCIONES
│   ├── LEEME — reglas de anonimización.docx
│   ├── 2026-08 Sesión 1/
│   ├── 2026-09 Sesión 2/
│   └── _Formato de caso.docx
│
├── 04 · SESIONES
│   ├── 2026-08-13 Sesión 1/
│   │   ├── Insumo generado por el micrositio.md
│   │   ├── Insumo generado por el micrositio.pdf
│   │   ├── Minuta.docx
│   │   └── Grabación y transcripción/
│   └── 2026-09-XX Sesión 2/
│
├── 05 · PROPUESTAS A LA UIF
│   ├── Lista consolidada de códigos faltantes.xlsx
│   ├── Propuestas por tipología/
│   └── Correspondencia con la UIF/
│
├── 06 · NORMATIVA Y REFERENCIA
│   ├── Layout de reportes y catálogo de códigos/
│   ├── Disposiciones aplicables/
│   ├── Tipologías publicadas (UIF, GAFI, GAFILAT)/
│   └── Listas y jurisdicciones/
│
└── 07 · TRABAJO INTERNO DEL EQUIPO FACILITADOR
    └── (borradores, pendientes, material en preparación)
```

---

## Qué va en cada carpeta

### 00 · EMPIEZA AQUÍ

La carpeta que evita la pregunta *"¿y dónde está…?"*. Tres archivos, ninguno más:

- **LEEME** — para qué existe el repositorio, quién puede subir, a quién se le pide acceso.
- **Ligas de las herramientas** — micrositio del taller, liga de aportes, catálogo de tipologías
  de la UIF y panel de riesgo de jurisdicciones. En un `.txt` para que se pueda copiar y pegar.
- **Calendario de sesiones** — fechas, tipologías asignadas a cada una y qué se espera recibir antes.

### 01 · MANUAL

Solo la versión vigente en la raíz. Todo lo demás va a `Versiones anteriores/`.
Regla: **un solo archivo se llama "versión vigente"**, y ese nombre no cambia nunca.
Así las ligas que la gente guarde siguen sirviendo.

### 02 · FICHAS POR TIPOLOGÍA

Una carpeta numerada por tipología, en el orden en que se van trabajando. Dentro de cada una:

```
Ficha — [tipología] v1.docx        el documento de trabajo
Insumos del taller/                lo que exportó el micrositio
Casos que la sustentan/            accesos directos a los casos de la carpeta 03
Señales y parámetros.xlsx          tabla de variable / umbral / ventana / institución
```

La tabla de señales y parámetros es la que más se va a usar. Columnas sugeridas:

| Señal | Variable | Umbral | Ventana | ¿Sistema o analista? | Institución que la aporta | Sesión |
|---|---|---|---|---|---|---|

### 03 · CASOS APORTADOS POR LAS INSTITUCIONES

Una subcarpeta por sesión, con el nombre en formato `AAAA-MM Sesión N`, para que ordenen solas.

**Convención de nombres de archivo:**

```
[Tipología] — [Institución] — [AAAA-MM-DD].docx
Cuentas mula — SOFIPO Ejemplo — 2026-09-02.docx
```

El `LEEME — reglas de anonimización` debe decir, en una página: sin nombres, sin RFC, sin números
de cuenta, sin montos exactos —redondear—, sin fechas exactas —basta mes y año—, y sin nada que
permita reconstruir al cliente cruzando datos. Es lo que protege a quien comparte.

### 04 · SESIONES

Todo lo que produjo cada sesión, incluido el archivo que exporta el micrositio al cerrar.
Ese `.md` es el borrador de las fichas: es lo primero que se sube, el mismo día.

### 05 · PROPUESTAS A LA UIF

El entregable final del ejercicio. La lista consolidada debe traer, por propuesta:

| Comportamiento | Por qué el catálogo actual no lo describe | Qué se propone | Instituciones que lo respaldan | Estado |
|---|---|---|---|---|

La columna de instituciones que lo respaldan es la que le da peso a la propuesta ante la UIF.

### 06 · NORMATIVA Y REFERENCIA

Material de consulta, no de trabajo. Cada documento con su fecha de corte en el nombre, porque
las listas y los layouts cambian y no hay nada peor que trabajar sobre una versión vencida.

### 07 · TRABAJO INTERNO

Permisos restringidos al equipo facilitador. Existe para que nadie confunda un borrador con
material del comité.

---

## Cuatro reglas que hacen que esto funcione

1. **El nombre del archivo lleva la fecha en formato `AAAA-MM-DD`.** Es lo único que hace que
   las cosas se ordenen solas.
2. **Un archivo, un lugar.** Si algo tiene que estar en dos carpetas, va un acceso directo, no
   una copia. Dos copias siempre terminan diferentes.
3. **Nada se borra: se mueve a `Versiones anteriores/`.** En un documento que va a la UIF, el
   rastro de cómo se llegó a una conclusión vale tanto como la conclusión.
4. **Cada carpeta tiene su `LEEME.txt` de dos renglones.** Dos renglones. Si necesita más, la
   carpeta está mal planteada.

---

## Permisos sugeridos

| Carpeta | Oficiales de cumplimiento | Equipo facilitador |
|---|---|---|
| 00, 01, 02, 06 | Lectura | Edición |
| 03 Casos | Edición sobre la subcarpeta de la sesión en curso | Edición |
| 04 Sesiones | Lectura | Edición |
| 05 Propuestas a la UIF | Comentarios | Edición |
| 07 Trabajo interno | Sin acceso | Edición |

Dar edición solo sobre la subcarpeta de la sesión en curso evita el problema clásico:
que alguien mueva o sobrescriba material de sesiones pasadas sin darse cuenta.
