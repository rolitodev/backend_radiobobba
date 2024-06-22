const { Pool } = require('pg');

require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Función para crear una nueva alianza
async function createAlianza(name, idRoom, image) {
    try {
        const query = 'INSERT INTO alianzas (name, idroom, image, active) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, idRoom, image, true];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Función para obtener todas las alianzas activas
async function getActiveAlianzas() {
    try {
        const query = 'SELECT * FROM alianzas WHERE active = true';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Función para actualizar el estado de una alianza
async function updateAlianza(id, active) {
    try {
        const query = 'UPDATE alianzas SET active = $1 WHERE id = $2 RETURNING *';
        const values = [active, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Función para eliminar una alianza por su ID
async function deleteAlianza(id) {
    try {
        const query = 'DELETE FROM alianzas WHERE id = $1';
        await pool.query(query, [id]);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAlianza,
    getActiveAlianzas,
    updateAlianza,
    deleteAlianza
};