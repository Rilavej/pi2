const express = require('express')
const server = express()
const router = require('./routes/router')
require('dotenv').config()
// require("./config/associations")

const PORT = process.env.PORT || 3000

// server.use(router)

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})

console.log(`mariadb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`)

console.log(process.cwd())

let ejs = require('ejs');
let people = ['geddy', 'neil', 'alex'];
let html = ejs.render('<h1\'red\'><%= people.join(", "); %></h1>', {people: people});

server.get('/ejs', (req,res)=>{
    res.send(html)
})

server.get('/', (req,res)=>{
    res.send(server.get('views'))
})