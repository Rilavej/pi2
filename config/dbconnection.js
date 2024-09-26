const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, 
    {
        host: process.env.HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        define: {
            timestamps: false, // para não utilizar campos created_at e updated_at
            freezeTableName: true // para não adicionar o "s" no nome das tabelas
        }
    });

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((error) => {
    console.error(`dbconnection.js: Erro ao conectar com o banco de dados:`, error);
});

module.exports = sequelize