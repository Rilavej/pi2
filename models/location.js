const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Location = sequelize.define(
    'Location',
    {
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'cityState'
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,    
            unique: 'cityState'        
        }
    },
    {
        // tableName: 'location'
    }
)

module.exports = Location