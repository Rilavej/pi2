const Pessoa = require('./pessoa');
const DataTypes = require('sequelize');
const sequelize = require('../config/dbconnection');

class Profissional extends Pessoa {}

Profissional.init(
    {
        person_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Atributos apenas do prfissional
        isSelfAdmin:{ 
            type: DataTypes.BOOLEAN,
            allowNull: false, // Se 'true' a pessoa poderá editar e validar o proprio perfil
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        business_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },    
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Profissional', // We need to choose the model name
        tableName: 'profissional', // Nome da tabela no banco de dados
    });

module.exports = Profissional