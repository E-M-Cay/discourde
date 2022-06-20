const { Sequelize, Model, DataTypes } = require('sequelize');
import sequelize from '../database';
import Role from './Role';

const Permission = sequelize.define('Permission', {
  name: DataTypes.STRING,
});

Permission.belongsToMany(Role, {
  through: 'RolePermissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
});

export default Permission;
