const mysql2 = require('mysql2/promise')
require('dotenv').config()

const connection = (async ()=>{

    const connection = await mysql2.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })

    try {
        const sql = `DROP SCHEMA IF EXISTS\`${process.env.DATABASE}\`` 
        const [results] = await connection.query({sql})
        // console.log(results)
        console.log(`Schema ${process.env.DATABASE} excluído com sucesso.`)
        await connection.end()
        console.log(`Conexão usada na exclusão do schema ${process.env.DATABASE} foi encerrada com sucesso.`)
        
    } catch (error) {
        console.error(`dbcreate.js: Ocorreu um erro ao excluir o schema.`, error)
    }

})();

module.exports = connection