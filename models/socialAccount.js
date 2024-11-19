const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')
const Media = require('./media')

const SocialAccount = sequelize.define(
    'SocialAccount',
    {
        link: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        // tableName: 'socialAccount'
    }
)

module.exports = SocialAccount