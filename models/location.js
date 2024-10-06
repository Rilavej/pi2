const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Location = sequelize.define(
    'Location',
    {
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,            
        }
    },
    {
        // tableName: 'location'
    }
)

module.exports = Location