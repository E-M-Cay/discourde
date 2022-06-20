const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Server from "./Server"

const Channel = sequelize.define('Channel', {
    name: DataTypes.STRING,
    hidden: DataTypes.BOOLEAN,
});

Channel.hasOne(Server, {
    foreignKey: "server_id"
})

export default Channel