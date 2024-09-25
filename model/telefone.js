const DataTypes = require('sequelize')
const sequelize = require('../config/dbconnection');

const Telefone = sequelize.define(
    'Telefone',
    {
        numero_telefone: {
            type: DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
        },
        id_pessoa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'Pessoa', key: 'person_id'},
            onDelete: 'CASCADE',
        }
    },
    {
        tableName: 'telefone'
    }
);

module.exports = Telefone