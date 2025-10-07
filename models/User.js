// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Por favor, añade un email.'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, añade un email válido.'
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor, añade una contraseña.'],
        minlength: 6,
        select: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware PRE-GUARDADO: Encriptar contraseña
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para generar un token JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Método para comparar la contraseña
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🚨 CORRECCIÓN: Exportación nombrada
export const User = mongoose.model('User', UserSchema);