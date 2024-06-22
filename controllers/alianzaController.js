const { Pool } = require('pg');

// require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
    user: 'radiobobba',
    host: 'postgresql-radiobobba.alwaysdata.net',
    database: 'radiobobba_bd',
    password: 'ayZykpQP23SvXyt',
    port:5432
});

// Función para crear una nueva alianza
async function createAlianza(name, idRoom, image) {
    try {
        const query = 'INSERT INTO alianza (name, idroom, image, active) VALUES ($1, $2, $3, $4) RETURNING *';
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
        const query = 'SELECT * FROM alianza WHERE active = true';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Función para actualizar el estado de una alianza
async function updateAlianza(id, active) {
    try {
        const query = 'UPDATE alianza SET active = $1 WHERE id = $2 RETURNING *';
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
        const query = 'DELETE FROM alianza WHERE id = $1';
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