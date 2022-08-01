import { DataSource } from 'typeorm';

// const AppDataSource = new DataSource({
//     type: 'mariadb',
//     host: 'j5zntocs2dn6c3fj.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
//     port: 3306,
//     username: 'wmmozcjrjf29dr7w',
//     password: 'havhny5fifnr5hzp',
//     database: 'jck4qsrp1swaqkzv',
//     entities: ['entities/*{.js,.ts}'],
//     migrations: ['migrations/*{.js,.ts}'],
// });

const AppDataSource = new DataSource({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'discourde',
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
