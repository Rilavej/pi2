const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const State = sequelize.define(
    'State',
    {
        stateAbbreviation: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        // stateName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
    },
    {
        // tableName: 'state'
    }
)

module.exports = State