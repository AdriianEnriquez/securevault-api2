import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import passwordRoutes from './routes/passwordRoutes.js'; 
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();


app.use(cors({
    origin: true, 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser()); 

app.get('/', (req, res) => {
    res.send('API de SecureVault en ejecución.');
});

app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Node.js corriendo en el puerto ${PORT}`);
});