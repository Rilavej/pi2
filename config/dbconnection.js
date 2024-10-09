require('dotenv').config()
const {Sequelize} = require('sequelize')

// const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, 
const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`, 
    {
        //host: process.env.HOST,
        //port: process.env.DB_PORT,
        dialect: "mysql",
        define: {
            timestamps: false, // para não utilizar campos created_at e updated_at
            // freezeTableName: true // para não adicionar o "s" no nome das tabelas
        }
    });

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((error) => {
    console.error(`dbconnection.js: Erro ao conectar com o banco de dados:`, error);
});

module.exports = sequelize