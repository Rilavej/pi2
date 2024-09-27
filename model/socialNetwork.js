const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const SocialNetwork = sequelize.define(
    'SocialNetwork',
    {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
        }
    },
    {
        tableName: 'socialNetwork'
    }
)

module.exports = SocialNetwork