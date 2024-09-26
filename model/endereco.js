const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Endereco = sequelize.define(
    'Endereco',
    {   
        endereco_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        logradouro: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        numero_casa: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        complemento: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        nome_cidade: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {model: 'Cidade', key: 'nome_cidade'},
            onDelete: 'CASCADE',
        },
        sigla_uf: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {model: 'Uf', key: 'sigla_uf'},
            onDelete: 'CASCADE',
        },
        id_pessoa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'Pessoa', key: 'person_id'},
            onDelete: 'CASCADE',
        },
        
    },
    {
        tableName: 'endereco'
    })

    module.exports = Endereco