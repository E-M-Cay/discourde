const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import User from "./User";

const PrivateMessage =  sequelize.define('PrivateMessage', {
    content: DataTypes.STRING,
    send_time: DataTypes.DATE
});

PrivateMessage.belongsTo(User, {
    foreignKey: {
        name: 'author_id',
        allowNull: false
    }
})
PrivateMessage.belongsTo(User, {
    foreignKey: {
        name: 'receiver_id',
        allowNull: false
    }
})

export default PrivateMessage;