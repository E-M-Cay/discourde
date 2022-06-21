const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"


const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,

});


export default Permission

