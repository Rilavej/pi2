const sequelize = require('../config/dbconnection');
const DataTypes = require('sequelize');
const Pessoa = require('./pessoa');

class Adm extends Pessoa {}

// Terá privilégios para editar todos os perfils
Adm.init(
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
    },    
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Adm', // We need to choose the model name
        tableName: 'adm', // Nome da tabela no banco de dados
    });

    module.exports = Adm