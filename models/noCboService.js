const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

// Tabela exclusiva para possíveis ocupações inexistentes no CBO
const noCboService = sequelize.define(
    'noCboService',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
    },
)

module.exports = noCboService