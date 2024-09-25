const sequelize = require('../config/dbconnection');
const DataTypes = require('sequelize');

const ContaSocial = sequelize.define(
    'ContaSocial',
    {
        link: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        nome_rede_social: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {model: 'RedeSocial', key: 'nome_rede_social'},
            onDelete: 'CASCADE',
        },
        id_pessoa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'Pessoa', key: 'person_id'},
            onDelete: 'CASCADE',
        }
    },
    {tableName: 'contaSocial'}
)

module.exports = ContaSocial