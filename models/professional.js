const Person = require('./person');
const DataTypes = require('sequelize');
const sequelize = require('../config/dbconnection');

class Professional extends Person {}

Professional.init(
    {
        // Atributos apenas do prfissional
        isSelfManaged:{ 
            type: DataTypes.BOOLEAN,
            allowNull: false, // Se 'true' a person poderá editar e validar o proprio perfil
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jobDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },    
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Professional', // We need to choose the model name
        tableName: 'professional', // Nome da tabela no banco de dados
    }
)

module.exports = Professional