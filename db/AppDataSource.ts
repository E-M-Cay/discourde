import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mariadb',
  host: 'j5zntocs2dn6c3fj.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
  port: 3306,
  username: 'oxoql4kfui8g6j06',
  password: 'p52uj1cxaa204dll',
  database: 't5ipem5ur4w70u2m',
});

export default AppDataSource;
