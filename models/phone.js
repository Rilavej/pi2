const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Phone = sequelize.define(
    'Phone',
    {
        phone: {
            type: DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
    },
    {
        // tableName: 'phone'
    }
)

module.exports = Phone