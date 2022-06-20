const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"

const Server =  sequelize.define('Server', {
    name: DataTypes.STRING,
    main_img: {type: DataTypes.STRING, allowNull: true},
    logo: {type: DataTypes.STRING, allowNull: true},
});

export default Server;