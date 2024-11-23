const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Service = sequelize.define(
    'Service',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    }
)

module.exports = Service