import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

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
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default AppDataSource;
