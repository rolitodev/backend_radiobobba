const express = require('express');
const router = express.Router();

const alianzaController = require('../controllers/alianzaController');

// Endpoint para crear una nueva alianza
router.post('/alianzas', async (req, res) => {
    const { name, idRoom, image, active } = req.body;

    try {
        const nuevaAlianza = await alianzaController.createAlianza(name, idRoom, image, active);
        res.status(201).json({ message: 'Alianza creada exitosamente', alianza: nuevaAlianza });
    } catch (error) {
        console.error('Error al crear alianza:', error);
        res.status(500).json({ message: 'Ocurrió un error al crear la alianza' });
    }
});

// Endpoint para obtener todas las alianzas activas
router.get('/alianzas', async (req, res) => {
    try {
        const alianzasActivas = await alianzaController.getActiveAlianzas();
        res.json(alianzasActivas);
    } catch (error) {
        console.error('Error al obtener alianzas activas:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener las alianzas activas' });
    }
});

// Endpoint para actualizar el estado de una alianza por su ID
router.put('/alianzas/:id', async (req, res) => {
    const id = req.params.id;
    const { active } = req.body;

    try {
        const alianzaActualizada = await alianzaController.updateAlianza(id, active);
        if (!alianzaActualizada) {
            return res.status(404).json({ message: 'Alianza no encontrada' });
        }
        res.json({ message: 'Alianza actualizada exitosamente', alianza: alianzaActualizada });
    } catch (error) {
        console.error('Error al actualizar alianza:', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar la alianza' });
    }
});

// Endpoint para eliminar una alianza por su ID
router.delete('/alianzas/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await alianzaController.deleteAlianza(id);
        res.json({ message: 'Alianza eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar alianza:', error);
        res.status(500).json({ message: 'Ocurrió un error al eliminar la alianza' });
    }
});

module.exports = router;