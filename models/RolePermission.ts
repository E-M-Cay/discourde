const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Role from "./Role"
import Permission from './Permission'

const RolePermission = sequelize.define('RolePermission', {

});

Role.belongsTo(Role, {
    foreignKey: "role_id"
})

Role.belongsTo(Permission, {
    foreignKey: "permission_id"
})


export default Role