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

// Función para obtener todos los usuarios activos
async function getUsersOfTeam() {
    try {
        const query = 'SELECT * FROM users WHERE active = true AND rank > 0';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsersOfTeam
};