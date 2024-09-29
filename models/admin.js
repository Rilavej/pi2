const Person = require('./person');
const DataTypes = require('sequelize');
const sequelize = require('../config/dbconnection');

class Admin extends Person {}

// Terá privilégios para editar todos os perfils
Admin.init(
    {
        
    },    
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Admin', // We need to choose the model name
        tableName: 'admin', // Nome da tabela no banco de dados
    }
)

module.exports = Admin