const express = require('express')
const server = express()
require('dotenv').config()
const router = require('./routes/router')

const PORT = process.env.PORT || 3000;

server.use(router)

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})

