const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import User from "./User";

const Server =  sequelize.define('Server', {
    name: DataTypes.STRING,
    main_img: {type: DataTypes.STRING, allowNull: true},
    logo: {type: DataTypes.STRING, allowNull: true},
});

Server.belongsTo(User, {
    foreignKey: "user_id"
})

export default Server;