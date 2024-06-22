const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');  // Asegúrate de que la ruta es correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://radiobobba-c2a3b.firebaseio.com"  // Reemplaza con la URL de tu base de datos
});

const db = admin.firestore();
module.exports = db;