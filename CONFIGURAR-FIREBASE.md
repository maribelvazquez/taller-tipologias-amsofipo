# Configurar Firebase para el taller — paso a paso

Este proyecto de Firebase es **exclusivo del taller de AMSOFIPO**. No comparte nada con
ningún otro sistema, y está pensado para poder entregárselo a la Comisión de PLD sin que
eso toque ninguna otra cuenta.

Tiempo aproximado: **15 minutos.** Solo se hace una vez.
No hace falta saber programar; el único archivo que se toca es `config-firebase.js`, y es
copiar y pegar.

---

## Paso 1 · Crear el proyecto

1. Entra a **<https://console.firebase.google.com>** con la cuenta de Google que vaya a
   ser dueña del proyecto.
2. Clic en **Crear un proyecto** (o *Add project*).
3. Nombre: **`taller-tipologias-amsofipo`**.
   Firebase le agrega unos caracteres al final para que el identificador sea único.
   Eso es normal — anota el identificador que quede, se usa más adelante.
4. En la pantalla de **Google Analytics**, elige **Desactivar**. El taller no lo usa y así
   evitas configurar una cuenta de Analytics que no vas a ver.
5. Clic en **Crear proyecto** y espera a que termine.

---

## Paso 2 · Registrar la aplicación web

1. Ya dentro del proyecto, en la pantalla principal busca los iconos de plataforma
   (iOS, Android, web). Clic en el de **web**, que se ve así: **`</>`**
2. Sobrenombre de la app: **`micrositio-taller`**.
3. **No** marques la casilla de Firebase Hosting. El micrositio se publica en Netlify.
4. Clic en **Registrar app**.
5. Firebase muestra un bloque de código. Lo que necesitas es solo esta parte:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "taller-tipologias-amsofipo.firebaseapp.com",
     projectId: "taller-tipologias-amsofipo",
     storageBucket: "taller-tipologias-amsofipo.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

6. Cópialo. Si cierras la ventana antes de copiarlo, no pasa nada: siempre está en
   **⚙ Configuración del proyecto → Tus apps**.

---

## Paso 3 · Pegarlo en el micrositio

1. Abre el archivo **`config-firebase.js`** del proyecto con cualquier editor de texto
   (el Bloc de notas sirve).
2. Sustituye el bloque de ejemplo por el que copiaste. Debe quedar así:

   ```js
   window.FB_CONFIG = {
     apiKey: "AIza...",
     authDomain: "taller-tipologias-amsofipo.firebaseapp.com",
     projectId: "taller-tipologias-amsofipo",
     storageBucket: "taller-tipologias-amsofipo.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

   **Ojo con dos detalles:** que siga diciendo `window.FB_CONFIG =` al principio (no
   `const firebaseConfig`), y que no se pierda el punto y coma del final.

3. Guarda el archivo. Es el único que se toca.

---

## Paso 4 · Activar el acceso anónimo

Esto permite que el micrositio entre a la base sin pedirle a nadie que se registre, y a la
vez impide que un desconocido escriba desde fuera con un script.

1. En el menú de la izquierda: **Compilación → Authentication**.
2. Clic en **Comenzar**.
3. Pestaña **Sign-in method** (Método de acceso).
4. En la lista, busca **Anónimo** y ábrelo.
5. Activa el interruptor **Habilitar** y clic en **Guardar**.

Debe quedar como *Habilitado*. Nadie va a ver una pantalla de login: es invisible.

---

## Paso 5 · Crear la base de datos

1. Menú de la izquierda: **Compilación → Firestore Database**.
2. Clic en **Crear base de datos**.
3. Ubicación: elige una de Estados Unidos, por ejemplo **`us-central1`** o **`nam5`**.
   Es la más cercana y la más barata. **La ubicación no se puede cambiar después**, así que
   no la dejes en Europa por descuido.
4. Cuando pregunte por el modo, elige **modo de producción** (bloqueado).
   No importa que quede todo cerrado: el siguiente paso pone las reglas correctas.
5. Clic en **Crear**.

No hay que crear ninguna colección a mano. `taller_aportes` y `taller_estado` se crean solas
con el primer aporte.

---

## Paso 6 · Publicar las reglas

Este paso es **obligatorio**. Sin él la base queda cerrada y el taller se queda en modo local.

1. En **Firestore Database**, pestaña **Reglas**.
2. Borra todo lo que haya en el recuadro.
3. Abre el archivo **`REGLAS-FIREBASE.txt`**, copia el bloque de reglas completo y pégalo.
4. Clic en **Publicar**.

Debe aparecer un aviso de que las reglas se publicaron correctamente.

---

## Paso 7 · Probar que quedó

1. Publica el micrositio en Netlify con el archivo `config-firebase.js` ya editado.
   (Si estás probando en tu computadora, abre `index.html` con doble clic; funciona igual.)
2. En el micrositio: **⚙ Sala → Probar conexión**.
   Debe decir **"Conectado a taller-tipologias-amsofipo"**.
3. Elige el modo **Facilitador** y clic en **Activar**. El indicador del encabezado debe
   ponerse en verde y decir **"En vivo · Sesión N"**.
4. Abre la liga de participantes en tu teléfono y manda un aporte de prueba.
   Debe aparecer en el tablero de cierre de tu computadora en el momento.
5. Borra el aporte de prueba: **Firestore Database → taller_aportes**, seleccionas el
   documento y lo eliminas.

### Si algo no sale

| Dice | Qué falta |
|---|---|
| "Falta configurar Firebase" | El `config-firebase.js` sigue con los valores de ejemplo, o no se guardó |
| "Firebase respondió sin permiso" | Falta el paso 4 (acceso anónimo) o el paso 6 (publicar reglas) |
| "No cargó Firebase — modo local" | No hay internet, o la red del lugar bloquea `gstatic.com` |

En los tres casos el taller **sigue funcionando** en modo local: cada quien guarda lo suyo en
su navegador y no hay sincronización. La sesión no se rompe.

---

## Paso 8 · Entregárselo a AMSOFIPO

Cuando el proyecto vaya a quedar en manos de la Comisión, no hay que rehacer nada: se agrega
a la persona que corresponda como propietaria.

1. **⚙ Configuración del proyecto → Usuarios y permisos**.
2. **Agregar miembro**, con el correo institucional de quien vaya a administrarlo.
3. Rol: **Propietario**.
4. Cuando acepte la invitación y confirmes que tiene acceso, tu cuenta se puede quitar del
   proyecto desde esa misma pantalla.

Como el proyecto es exclusivo del taller, entregarlo no toca ningún otro sistema.

---

## Paso 9 · Vigilar el costo (spoiler: no hay)

Firestore tiene una capa gratuita de **50,000 lecturas y 20,000 escrituras al día**. Un taller
de 20 instituciones con 30 aportes usa unas 30 escrituras y unos cuantos cientos de lecturas.
Está dos o tres órdenes de magnitud por debajo del límite.

Aun así, conviene dejar el plan en **Spark (gratuito)** y no subirlo a *Blaze*. En Spark, si
algún día se rebasara la cuota, el servicio simplemente deja de responder ese día —el taller
cae a modo local— en lugar de generar un cargo.

Se revisa en **⚙ Configuración → Uso y facturación**.
