const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

require('dotenv').config();

// Configuración de la base de datos usando variables de entorno
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

// Clave secreta para firmar los tokens obtenida de las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Método de registro
const register = async (req, res) => {
    const { name, password, email, rank } = req.body;

    if (!name || !password || !rank) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios (name, password, rank).' });
    }

    try {
        // Verificar si el usuario ya existe
        const userCheck = await executeQuery('SELECT * FROM users WHERE name = ?', [name]);

        if (userCheck.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está registrado. Intenta con otro.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = {
            name,
            password: hashedPassword,
            email,
            active: true,
            rank,
            register_date: new Date().toISOString()
        };

        // Guardar el usuario en la base de datos
        const insertUser = await executeQuery(
            'INSERT INTO users (name, password, email, active, rank, register_date) VALUES (?, ?, ?, ?, ?, ?)',
            [newUser.name, newUser.password, newUser.email, newUser.active, newUser.rank, newUser.register_date]
        );

        // Verificar si se insertó una fila
        if (insertUser.affectedRows === 1) {
            res.status(201).json({ message: 'Usuario registrado con éxito.' });
        } else {
            res.status(500).json({ message: 'Ocurrió un error al registrar el usuario.' });
        }

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Ocurrió un error inesperado. Inténtalo de nuevo.', bd_error: error });
    }
};

// Método de login con generación de JWT
const login = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios (name, password).' });
    }

    try {
        // Verificar si el usuario existe y está activo
        const userCheck = await executeQuery('SELECT * FROM users WHERE name = ? AND active = ?', [name, true]);

        if (userCheck.length === 0) {
            return res.status(400).json({ message: 'El usuario no existe o está inactivo.' });
        }

        const user = userCheck[0];

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            {
                id: user.id, // Asegúrate de que el campo "id" exista en tu tabla de usuarios.
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expirará en 24 horas
        );

        // Responder con el token
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user: {
                name: user.name,
                email: user.email,
                token: token,
                rank: user.rank
            }
        });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Ocurrió un error inesperado. Inténtalo de nuevo.', bd_error: error });
    }
};

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

module.exports = { register, login };