import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import upsertPermissions from './upsertPermissions';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mariadb',
    url: process.env.DB,
    entities: ['entities/*{.js,.ts}'],
    migrations: ['migrations/*{.js,.ts}'],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        upsertPermissions(AppDataSource);
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default AppDataSource;
