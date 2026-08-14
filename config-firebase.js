/* =========================================================================
   CONFIGURACIÓN DE FIREBASE — Taller de Tipologías AMSOFIPO
   =========================================================================

   Proyecto: taller-tipologias-amsofipo
   Exclusivo del taller. No comparte datos con ningún otro sistema.

   Este es el ÚNICO archivo que hay que editar para conectar el taller a su
   base de datos. Los pasos completos están en CONFIGURAR-FIREBASE.md.

   Falta todavía, en la consola de Firebase:
     · Authentication → Sign-in method → Anónimo → Habilitar
     · Firestore Database → Crear base de datos (ubicación us-central1 o nam5)
     · Firestore Database → Reglas → pegar REGLAS-FIREBASE.txt → Publicar

   Nota sobre estas claves: la configuración de Firebase para web es pública
   por diseño, viaja en el navegador de todos los usuarios y no es un secreto.
   Lo que protege la base son las reglas de Firestore, no estas líneas.
   Por eso REGLAS-FIREBASE.txt no es opcional.
   ========================================================================= */

window.FB_CONFIG = {
  apiKey: "AIzaSyAz18qfOWKWYDmYtPaUHMvCbonWnX-oNcY",
  authDomain: "taller-tipologias-amsofipo.firebaseapp.com",
  projectId: "taller-tipologias-amsofipo",
  storageBucket: "taller-tipologias-amsofipo.firebasestorage.app",
  messagingSenderId: "795876034727",
  appId: "1:795876034727:web:deaef17a09246dd4d2b382"
};

/* Colecciones que usa el taller. No hace falta crearlas a mano:
   se crean solas con el primer aporte. */
window.FB_COLECCIONES = {
  aportes: "taller_aportes",
  estado: "taller_estado"
};
