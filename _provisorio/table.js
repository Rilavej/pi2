const mysql2 = require('mysql2/promise')
require('dotenv').config();

const table = (async ()=> {

    const connection = await mysql2.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
    
    try {

        await connection.query(`USE ${process.env.DATABASE}`)

        const sql = `INSERT INTO Locations (city, state) \
        VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?);`

        // values?: any | any[] | { [param: string]: any };
        const values = [
            'Salvador', 'BA',
            'Camaçari', 'BA',
            'Florianópolis', 'SC',
            'São Lourenço do Oeste', 'SC',
            'Rio de Janeiro', 'RJ',
            'Algum Lugar', 'RJ',
            'São Paulo', 'SP',
            'Algum Lugar', 'SP',
        ]

        const [results] = await connection.query({
            sql,
            values
        })
        console.log(`Tabela Location preenchida com sucesso.`)

        await connection.query(
            'INSERT INTO PDigitals (platform) VALUES (?),(?),(?),(?)',
            ["WhatsApp","Instagran","Facebook","LinkedIn",]
        )
        console.log("Tabela PDigitals preenchida com sucesso.")

        await connection.end()
        console.log(`Conexão usada no preenchimento foi encerrada com sucesso.`)
        
    } catch (error) {
        console.error(`Ocorreu um erro ao preencher as tabelas.`, error)
    }

})();

module.exports = table
