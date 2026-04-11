import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { AppRouter } from './src/infrastructure/http/routes'; // Ajusta la ruta si es diferente
import { AppDataSource } from './src/infrastructure/db/data-source'; // Ajusta la ruta si es diferente

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- MIDDLEWARE CORREGIDO CON LOGS ---
app.use((req, res, next) => {
  // 1. Log para atrapar TODA petición entrante y ver cómo la manda Stripe
  console.log(`🌍 Petición entrante: [${req.method}] ${req.originalUrl}`);

  // 2. Usamos .includes() para que sea flexible a slashes finales o parámetros
  if (req.originalUrl.includes('/payments/webhook')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(AppRouter);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Base de datos conectada con éxito');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  });