// routes/authRoutes.js

import express from 'express';
import { User } from '../models/User.js'; 

const router = express.Router();

// Función auxiliar MODIFICADA: Establece el Token en una Cookie HTTP-Only
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken(); 
    
    // Opciones de la Cookie para Seguridad:
    const options = {
        // Calcula la fecha de expiración basada en la variable de entorno (ej. 30 días)
        expires: new Date(Date.now() + process.env.JWT_EXPIRE.replace('d', '') * 24 * 60 * 60 * 1000), 
        httpOnly: true, // 🚨 CLAVE: Impide el acceso del lado del cliente (Anti-XSS)
        secure: process.env.NODE_ENV === 'production', // Solo se envía en HTTPS (Recomendado para AWS)
        sameSite: 'strict', // Protección CSRF
    };

    // 1. Establecer la cookie 'token'
    res.status(statusCode).cookie('token', token, options);

    // 2. Enviar la respuesta JSON al cliente (sin el token en el cuerpo)
    res.json({
        success: true,
        userId: user._id,
        message: 'Autenticación exitosa. Token guardado en cookie.'
    });
};

// @desc    Registrar Usuario
// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        sendTokenResponse(user, 200, res); // Establece la cookie
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Este email ya está registrado.' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Iniciar Sesión
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Por favor, proporciona email y contraseña.' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
        }
        sendTokenResponse(user, 200, res); // Establece la cookie
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error del servidor al iniciar sesión.' });
    }
};

// @desc    Cerrar Sesión
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
    // Borra la cookie, cerrando la sesión en el cliente
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expira en 10 segundos
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});


router.post('/register', register);
router.post('/login', login);

export default router;