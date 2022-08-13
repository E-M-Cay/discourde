import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mariadb',
    url: process.env.DB,
    entities: ['entities/*{.js,.ts}'],
    migrations: ['migrations/*{.js,.ts}'],
});

export default AppDataSource;
