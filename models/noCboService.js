const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

// Tabela exclusiva para possíveis ocupações inexistentes no CBO
const NoCboService = sequelize.define(
    'NoCboService',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
)

module.exports = NoCboService