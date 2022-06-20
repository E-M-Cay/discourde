const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Role from './Role'
import User from './User'

const UserRole = sequelize.define('UserRole', {

});

UserRole.hasOne(Role, {
    foreignKey: "role_id"
})
UserRole.hasOne(User, {
    foreignKey: "user_id"
})


export default Role