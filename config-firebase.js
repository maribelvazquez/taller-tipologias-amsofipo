/* =========================================================================
   CONFIGURACIÓN DE FIREBASE — Taller de Tipologías AMSOFIPO
   =========================================================================

   Este es el ÚNICO archivo que hay que editar para conectar el taller a su
   base de datos. No hace falta tocar nada más.

   Pasos completos en CONFIGURAR-FIREBASE.md. En corto:

     1. console.firebase.google.com → Agregar proyecto
        Nombre sugerido: taller-tipologias-amsofipo
     2. Dentro del proyecto → icono web  </>  → registrar una app web
     3. Firebase copia un bloque "firebaseConfig" — pégalo abajo,
        sustituyendo los valores de ejemplo
     4. Authentication → Sign-in method → Anónimo → Habilitar
     5. Firestore Database → Crear base de datos → pestaña Reglas
        → pegar el contenido de REGLAS-FIREBASE.txt → Publicar

   IMPORTANTE: este proyecto debe ser DISTINTO al de cualquier otro sistema.
   El taller crea sus propias colecciones (taller_aportes y taller_estado) y
   no comparte datos con nada más.

   Nota sobre estas claves: la configuración de Firebase para web es pública
   por diseño, viaja en el navegador de todos los usuarios y no es un secreto.
   Lo que protege la base son las reglas de Firestore, no estas líneas.
   Por eso REGLAS-FIREBASE.txt no es opcional.

   Si este archivo se deja con los valores de ejemplo, el taller funciona
   igual pero en MODO LOCAL: cada quien guarda lo suyo en su navegador y no
   hay sincronización entre pantallas.
   ========================================================================= */

window.FB_CONFIG = {
  apiKey: "PEGA-AQUI-TU-API-KEY",
  authDomain: "PEGA-AQUI.firebaseapp.com",
  projectId: "PEGA-AQUI",
  storageBucket: "PEGA-AQUI.firebasestorage.app",
  messagingSenderId: "PEGA-AQUI",
  appId: "PEGA-AQUI"
};

/* Colecciones que usa el taller. No hace falta crearlas a mano:
   se crean solas con el primer aporte. */
window.FB_COLECCIONES = {
  aportes: "taller_aportes",
  estado: "taller_estado"
};
