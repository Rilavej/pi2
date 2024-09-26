const Pessoa = require('./pessoa');
const DataTypes = require('sequelize');
const sequelize = require('../config/dbconnection');

class Admin extends Pessoa {}

// Terá privilégios para editar todos os perfils
Admin.init(
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
        modelName: 'Admin', // We need to choose the model name
        tableName: 'admin', // Nome da tabela no banco de dados
    });

    module.exports = Admin