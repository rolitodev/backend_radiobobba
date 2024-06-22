const cors = require('cors');
const express = require('express');
const moment = require('moment-timezone');

// const { deleteItemsFromFirebase } = require('./routes/firebase_delete');

const authRoutes = require('./routes/auth');
const alianzaRoute = require('./routes/alianza');
const usersRoute = require('./routes/users');

const app = express();

// Configuramos CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);
app.use('/alliance', alianzaRoute);
app.use('/users', usersRoute);

app.listen(3000, () => {
    const bogotaTime = moment.tz("America/Bogota").format(); // Obtener la hora actual en la zona horaria de Bogotá
    console.log(`Server is running on port 3000. Current time in Bogota: ${bogotaTime}`);
    // Eliminar documentos antiguos cada 12 horas
    // setInterval(deleteItemsFromFirebase, 12 * 60 * 60 * 1000);
});
