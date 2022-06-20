import { Sequelize } from "sequelize";

const sequelize = new Sequelize('t5ipem5ur4w70u2m', 'oxoql4kfui8g6j06', 'p52uj1cxaa204dll', {
  dialect: 'mariadb',
  host: 'j5zntocs2dn6c3fj.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
});

export default sequelize
