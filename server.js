const express = require('express')
const server = express()
const router = require('./routes/router');
require('dotenv').config();
require('./config/associations');
const path = require('path')
const passport = require('passport');
require('./security/authentication')(passport);
var session = require('express-session') // proximo a fazer

const PORT = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(router)

// https://expressjs.com/en/4x/api.html#app.set
// Define configurações do servidor relacionadas a view engine
server.set('views', path.join(__dirname, './views'))
server.set('view engine', 'ejs')

server.listen(PORT, ()=>{
    console.log(`Servidor escutando a porta ${PORT}.`)
})