const mysql = require('mysql');

require('dotenv').config();

// Configuración de la base de datos
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

// Función para crear una nueva alianza
async function createAlianza(name, idRoom, image) {
    try {
        const query = 'INSERT INTO alianza (name, idroom, image, active) VALUES (?, ?, ?, ?)';
        const values = [name, idRoom, image, true];
        const result = await executeQuery(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para obtener todas las alianzas activas
async function getActiveAlianzas() {
    try {
        const query = 'SELECT * FROM alianza WHERE active = ?';
        const values = [true];
        const result = await executeQuery(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para actualizar el estado de una alianza
async function updateAlianza(id, active) {
    try {
        const query = 'UPDATE alianza SET active = ? WHERE id = ?';
        const values = [active, id];
        const result = await executeQuery(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para eliminar una alianza por su ID
async function deleteAlianza(id) {
    try {
        const query = 'DELETE FROM alianza WHERE id = ?';
        const result = await executeQuery(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función genérica para ejecutar consultas
function executeQuery(query, values) {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    createAlianza,
    getActiveAlianzas,
    updateAlianza,
    deleteAlianza
};
