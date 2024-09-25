const sequelize = require('../config/dbconnection');
const DataTypes = require('sequelize');
const Pessoa = require('./pessoa');

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
        isAdm:{ 
            type: DataTypes.BOOLEAN,
            allowNull: false, // Se 'true' a pessoa poderá editar e validar o proprio perfil
        },
        profissao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao_negocio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },    
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Profissional', // We need to choose the model name
        tableName: 'profissional', // Nome da tabela no banco de dados
    });

(async ()=>{
    try {
        await Profissional.sync({alter: true}) // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
        console.log('Tabela profissional criada com sucesso.')

    } catch (error) {
        console.error(`profissional.js: Erro ao criar a tabela profissional.`, error)
    }
    
    const minusculo = await sequelize.models.profissional
    const MAIUSCULO = await sequelize.models.Profissional
    //const outro = await Profissional
    const subclasse = await sequelize.models.Pessoa.Profissional
    console.log("\nsequelize.models.profissional: " + minusculo)
    console.log("\nsequelize.models.Profissional: " + MAIUSCULO)
    console.log("\nconst Profissional: " + Profissional)
    console.log("\nsequelize.models.Pessoa.Profissional: " + subclasse)

})();

module.exports = Profissional;
