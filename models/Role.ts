const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Server from "./Server"
import User from './User'

const Role = sequelize.define('Role', {
    name: DataTypes.STRING,

});

Role.hasOne(Server, {
    foreignKey: "server_id"
})


export default Role