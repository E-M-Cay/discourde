import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mariadb',
  host: 'j5zntocs2dn6c3fj.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
  port: 3306,
  username: 'jqw2ja5erkzupc85',
  password: 'p1wrm3zmcpgt49ts',
  database: 'swrnmpcftzalh7to',
  entities: ['entities/*.ts'],
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
