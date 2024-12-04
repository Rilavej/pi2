const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

// Tabela exclusiva para possíveis ocupações inexistentes no CBO
const NoCboService = sequelize.define(
    'NoCboService',
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

module.exports = NoCboService