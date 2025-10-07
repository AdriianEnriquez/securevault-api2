// server.js

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import passwordRoutes from './routes/passwordRoutes.js'; 
import cookieParser from 'cookie-parser';
// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware: Permite que Express maneje JSON en las peticiones
app.use(express.json());
app.use(cookieParser()); 
// --- Rutas ---
app.get('/', (req, res) => {
    res.send('API de SecureVault en ejecución.');
});

// Usar las rutas de autenticación y CRUD
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en modo desarrollo en el puerto ${PORT}`);
});