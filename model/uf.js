const DataTypes = require('sequelize')
const sequelize = require('../config/dbconnection');

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