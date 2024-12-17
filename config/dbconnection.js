require('dotenv').config()
const { Sequelize } = require('sequelize')

const mysql2 = require('mysql2/promise')
require('dotenv').config()

const fs = require('fs')
const path = require('path')


const connection = (async () => {

    const connection = mysql2.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    })

    try {
        const sql = `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\``
        const [results] = await connection.query({ sql })
        // console.log(results)
        console.log(`Schema ${process.env.DATABASE} criado com sucesso.`)
        await connection.end()
        console.log(`Conexão usada na criação do schema ${process.env.DATABASE} foi encerrada com sucesso.`)

    } catch (error) {
        console.error(`dbcreate.js: Ocorreu um erro ao criar o schema.`, error)
    }

    // })();

    // SHOW GLOBAL VARIABLES LIKE 'local_infile';

    // SET GLOBAL local_infile = true;

    // const table = (async () => {
    // const connection = await mysql2.createConnection({
    //     host: process.env.HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DATABASE
    // })
    // await connection.query(`USE ${process.env.DATABASE}`)

    try {
        const tableName = '`pi2`.`CBO`'
        const sql =
            `LOAD DATA LOW_PRIORITY LOCAL INFILE ? INTO TABLE ${tableName} FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (\`id\`, \`title\`);`
        const filePath = path.join(__dirname, '_CBO2002_OCUPACAO.csv')
        const result = await connection.query({
            sql,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath)
        })
        console.log(`Tabela ${tableName} preenchida com sucesso.`)
        console.log(result)
    } catch (err) { console.error(err, 'Erro na tabela CBOs') }

    try {
        const tableName = '`pi2`.`UF`'
        const sql =
            `LOAD DATA LOW_PRIORITY LOCAL INFILE ? INTO TABLE ${tableName} FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (\`id\`, \`name\`, \`abbreviation\`);`
        const filePath = path.join(__dirname, '_UF.csv')
        const result = await connection.query({
            sql,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath)
        })
        console.log(`Tabela ${tableName} preenchida com sucesso.`)
        console.log(result)
    } catch (err) { console.error(err, 'Erro na tabela UF') }

    try {
        const tableName = '`pi2`.`Municipios`'
        const sql =
            `LOAD DATA LOW_PRIORITY LOCAL INFILE ? INTO TABLE ${tableName} FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (\`id\`, \`name\`, \`UfId\`);`
        const filePath = path.join(__dirname, '_MUNICIPIO.csv')
        const result = await connection.query({
            sql,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath)
        })
        console.log(`Tabela ${tableName} preenchida com sucesso.`)
        console.log(result)
    } catch (err) { console.error(err, 'Erro na tabela municipios') }

    try {
        const tableName = 'Media'
        await connection.query(
            `INSERT IGNORE INTO ${tableName} (platform, domain) VALUES (?, ?), (?, ?), (?, ?), (?, ?)`,
            ["WhatsApp", "wa.me/55", "Instagran", "instagram.com/", "Facebook", "facebook.com/", "LinkedIn", "linkedin.com/in/",]

        )
        console.log(`Tabela ${tableName} preenchida com sucesso.`)
    } catch (err) { console.error(err) }

    connection.end().then(() =>
        console.log(`Conexão usada no preenchimento foi encerrada com sucesso.`)
    )

})();


// const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, 
const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`,
    {
        //host: process.env.HOST,
        //port: process.env.DB_PORT,
        dialect: "mysql",
        define: {
            timestamps: false, // para não utilizar campos created_at e updated_at
            // freezeTableName: true // para não adicionar o "s" no nome das tabelas
        },
        logging: false
    });

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((error) => {
    console.error(`dbconnection.js: Erro ao conectar com o banco de dados:`, error);
});

module.exports = sequelize