const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const PDigital = sequelize.define(
    'PDigital',
    {
        platform: {
            type: DataTypes.STRING,
            unique: true
        }
    },
    {
        // tableName: 'pDigital'
    }
)

module.exports = PDigital