const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Uf = sequelize.define(
    'Uf',
    {
        sigla_uf: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        }
    },
    {
        tableName: 'uf'
    }
)

module.exports = Uf