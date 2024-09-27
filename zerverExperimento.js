const express = require('express')
const server = express()
const router = require('./routes/router')
require('dotenv').config()
require("./config/associations")

const PORT = process.env.PORT || 3000

server.use(router)

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})

console.log(`mariadb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`)