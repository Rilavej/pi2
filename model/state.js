const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const State = sequelize.define(
    'State',
    {
        abbreviation: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'state'
    }
)

module.exports = State