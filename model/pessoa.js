const DataTypes = require('sequelize')
const sequelize = require('../config/dbconnection');

const Pessoa = sequelize.define(
    'Pessoa', // Nome do modelo e não da tabele. Na ausência do nome da tabela, está receberá o mesmo nome do modelo.
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
        tableName: 'pessoa'
    });

(async ()=>{
    try {
        // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
        await Pessoa.sync({alter: true})
        console.log('Tabela pessoa criada com sucesso.')

    } catch (error) {
        console.error(`pessoa.js: Erro ao criar a tabela pessoa.`, error)
    }
    
    const minusculo = await sequelize.models.pessoa
    const MAIUSCULO = await sequelize.models.Pessoa
    const outro = await Pessoa
    console.log("\nsequelize.models.pessoa: " + minusculo)
    console.log("\nsequelize.models.Pessoa: " + MAIUSCULO)
    console.log("\nconst Pessoa: " + outro)

})();

module.exports = Pessoa