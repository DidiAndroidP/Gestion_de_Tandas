import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';
import { TandaEntity } from './entities/TandaEntity';
import { ParticipantEntity } from './entities/ParticipantEntity';
import { PaymentEntity } from './entities/PaymentEntity';
import { InvitationEntity } from './entities/InvitationEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tandas_db',
  synchronize: true, 
  logging: process.env.NODE_ENV === 'development',
  entities: [
    UserEntity,
    TandaEntity,
    ParticipantEntity,
    PaymentEntity,
    InvitationEntity
  ],
  migrations: ['src/infrastructure/db/migrations/**/*.ts'],
  subscribers: [],
});