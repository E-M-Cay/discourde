const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Role from "./Role"
import Permission from './Permission'

const RolePermission = sequelize.define('RolePermission', {

});

Role.hasOne(Role, {
    foreignKey: "role_id"
})

Role.hasOne(Permission, {
    foreignKey: "permission_id"
})


export default Role