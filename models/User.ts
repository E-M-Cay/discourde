const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    join_date: DataTypes.DATE
});


export default User;