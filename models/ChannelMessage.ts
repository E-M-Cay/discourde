const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Channel from "./Channel"
import User from './User'

const ChannelMessage = sequelize.define('ChannelMessage', {
    content: DataTypes.STRING,
    send_time: DataTypes.DATE,

});

ChannelMessage.belongsTo(Channel, {
    foreignKey: "channel_id"
})
ChannelMessage.belongsTo(User, {
    foreignKey: "user_id"
})

export default ChannelMessage