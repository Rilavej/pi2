const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

// Tabela exclusiva para possíveis ocupações inexistentes no CBO
const noCboProfession = sequelize.define(
    'noCboProfession',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        jobDescription: {
            type: DataTypes.STRING,
        },
    },
)

module.exports = noCboProfession