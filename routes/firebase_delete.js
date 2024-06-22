const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase.json'); // Ruta al archivo de credenciales

// Verificar si Firebase Admin ya está inicializado
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

const firestore = admin.firestore();

// Función para eliminar documentos
async function deleteItemsFromFirebase() {
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - 12); // Fecha límite (12 horas antes de ahora)

    try {
        const snapshot = await firestore.collection('peticiones')
            .where('date', '<=', thresholdDate)
            .get();

        const batch = firestore.batch();

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('Registros eliminados correctamente.');
    } catch (error) {
        console.error('Error al eliminar registros:', error);
    }
}

module.exports = {
    deleteItemsFromFirebase
};