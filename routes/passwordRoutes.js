// routes/passwordRoutes.js

import express from 'express';
// 🚨 CORRECCIÓN: Importación nombrada
import { Password } from '../models/Password.js'; 
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

// ... (El resto del código del CRUD usa Password.find, Password.create, etc. con el mismo modelo)
// @desc    Obtener TODAS las contraseñas del USUARIO LOGUEADO
router.get('/', protect, async (req, res) => {
    try {
        const passwords = await Password.find({ user: req.user.id }); 
        res.json(passwords);
    } catch (err) {
        res.status(500).json({ error: 'Fallo al obtener contraseñas.' });
    }
});

// @desc    Crear una NUEVA contraseña para el USUARIO LOGUEADO
router.post('/', protect, async (req, res) => {
    try {
        const newPassword = await Password.create({
            ...req.body,
            user: req.user.id 
        });
        res.status(201).json(newPassword);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Actualizar contraseña (solo si le pertenece)
router.put('/:id', protect, async (req, res) => {
    let password = await Password.findById(req.params.id);
    if (!password) {
        return res.status(404).json({ success: false, error: 'Contraseña no encontrada.' });
    }
    if (password.user.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'Usuario no autorizado para actualizar esta contraseña.' });
    }
    password = await Password.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: password });
});

// @desc    Borrar contraseña (solo si le pertenece)
router.delete('/:id', protect, async (req, res) => {
    const password = await Password.findById(req.params.id);
    if (!password) {
        return res.status(404).json({ success: false, error: 'Contraseña no encontrada.' });
    }
    if (password.user.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'Usuario no autorizado para borrar esta contraseña.' });
    }
    await password.deleteOne();
    res.status(200).json({ success: true, data: {} });
});


export default router;