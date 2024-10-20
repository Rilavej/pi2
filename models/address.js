const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Address = sequelize.define(
    'Address',
    {   
        street: {
            type: DataTypes.STRING,
        },
        houseNum: {
            type: DataTypes.STRING,
        },
        complement: {
            type: DataTypes.STRING,
        },
    }
)

module.exports = Address