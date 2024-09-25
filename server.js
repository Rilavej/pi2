const express = require('express')
const server = express()
const router = require('./routes/router')
require('dotenv').config()
require("./config/associations")

const PORT = process.env.PORT || 3000;

server.use(router)

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})
