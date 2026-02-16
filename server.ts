import 'reflect-metadata'; 
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppRouter } from './src/infrastructure/http/routes';
import { AppDataSource } from './src/infrastructure/db/data-source';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(AppRouter);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });