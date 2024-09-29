const express = require('express')
const server = express()
const router = require('./routes/router')
require('dotenv').config()
require('./config/associations')
const path = require('path')

const PORT = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(router)

// https://expressjs.com/en/4x/api.html#app.set
// Define configurações do servidor
server.set('views', path.join(__dirname, './views'))
server.set('view engine', 'ejs')

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})