// models/Password.js

import mongoose from 'mongoose';

const PasswordSchema = new mongoose.Schema({
    // Enlace a la colección de Usuarios
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    siteName: {
        type: String,
        required: [true, 'Por favor, añade el nombre del sitio web/servicio.'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Por favor, añade un nombre de usuario o email.'],
    },
    passwordHash: { 
        type: String,
        required: [true, 'Por favor, añade la contraseña.'],
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 🚨 CORRECCIÓN: Exportación nombrada
export const Password = mongoose.model('Password', PasswordSchema);