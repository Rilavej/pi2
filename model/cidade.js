const DataTypes = require('sequelize')
const sequelize = require('../config/dbconnection');

const Cidade = sequelize.define(
    'Cidade',
    {
        nome_cidade: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        sigla_uf: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {model: 'Uf', key: 'sigla_uf'},
            onDelete: 'CASCADE'

        }
    },
    {
        tableName: 'cidade'
    }
)

module.exports = Cidade