const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Role from './Role'
import User from './User'

const UserRole = sequelize.define('UserRole', {

});

UserRole.belongsTo(Role, {
    foreignKey: "role_id"
})
UserRole.belongsTo(User, {
    foreignKey: "user_id"
})


export default Role