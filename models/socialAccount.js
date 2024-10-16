const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const SocialAccount = sequelize.define(
    'SocialAccount',
    {
        link: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    {
        // tableName: 'socialAccount'
    }
)

module.exports = SocialAccount