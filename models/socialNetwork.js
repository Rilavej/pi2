const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const SocialNetwork = sequelize.define(
    'SocialNetwork',
    {
        socialNetworkName: {
            type: DataTypes.STRING,
            primaryKey: true,
        }
    },
    {
        tableName: 'socialNetwork'
    }
)

module.exports = SocialNetwork