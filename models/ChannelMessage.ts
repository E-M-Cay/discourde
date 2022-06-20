const { Sequelize, Model, DataTypes } = require("sequelize")
import sequelize from "../database"
import Channel from "./Channel"
import User from './User'

const ChannelMessage = sequelize.define('ChannelMessage', {
    content: DataTypes.STRING,
    send_time: DataTypes.DATE,

});

Channel.hasOne(Channel, {
    foreignKey: "channel_id"
})
Channel.hasOne(User, {
    foreignKey: "user_id"
})

export default ChannelMessage