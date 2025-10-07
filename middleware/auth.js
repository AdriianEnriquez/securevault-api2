// middleware/auth.js

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; 

export const protect = async (req, res, next) => { 
    let token;

    // 🚨 CAMBIO CLAVE: Obtener el token de req.cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    } 
    // NOTA: El middleware ya NO busca el token en el encabezado Authorization

    // 2. Verificar que existe el token
    if (!token) {
        return res.status(401).json({ success: false, error: 'Acceso denegado, no hay token.' });
    }

    try {
        // 3. Verificar el token y obtener el ID del usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Adjuntar el objeto usuario al request para usarlo en el CRUD
        req.user = await User.findById(decoded.id).select('-password'); 

        next();
    } catch (err) {
        console.error("Error de token JWT:", err);
        return res.status(401).json({ success: false, error: 'Token inválido o expirado.' });
    }
};