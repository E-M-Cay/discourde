const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Role from "./Role"
import User from './User'

const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,

});


export default Permission