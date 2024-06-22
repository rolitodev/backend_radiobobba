const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/equipo', async (req, res) => {

    try {
        const activeUsersTeam = await usersController.getUsersOfTeam();
        res.json(activeUsersTeam);
    } catch (error) {
        console.error('Error al obtener los miembros del equipo activo:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los miembros del equipo.' });
    }

});

module.exports = router;