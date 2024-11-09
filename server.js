const express = require('express');
const server = express();
const router = require('./routes/router');
require('dotenv').config();
require('./config/associations');
const path = require('path');
const passport = require('passport');
require('./security/authentication')(passport);
var session = require('express-session');

(async function () {
    const { ufs, cbo } = await require('./cache/ufs&cbo')
    server.locals.ufs = ufs // define a variavel no objeto locals, tornando-a acessivel globalmente na view-engine
    server.locals.cbo = cbo
    // console.log(ufs) funciona
})();

const PORT = process.env.PORT || 3000

// ############################################# Estudar ######################################################
server.use(session({
    secret: process.env.SECRET,  //Chave secreta utilizada para assinar as sessões, garantindo a integridade e segurança das mesmas   
    resave: false, //Determina se a sessão deve ser regravada no armazenamento, mesmo que não tenha sido modificada
    saveUninitialized: true, //Define se a sessão deve ser salva no armazenamento, mesmo que não tenha sido modificada
    cookie: { maxAge: 10 * 60 * 1000 } //Define as configurações do cookie de sessão. maxAge está definido como 2 minutos (2 * 60 * 1000 milissegundos), especificando o tempo máximo de vida do cookie antes de expirar
}))
server.use(passport.initialize())
server.use(passport.session())
// ############################################################################################################

server.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.message = null
    // res.locals.err = {err: 'Erro interno do servidor'}
    next()
})
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static(path.join(__dirname, 'public')))
server.use(router)

// Define configurações do servidor relacionadas a view engine
// https://expressjs.com/en/4x/api.html#app.set
server.set('views', path.join(__dirname, './views'))
server.set('view engine', 'ejs')

server.listen(PORT, () => {
    console.log(`Servidor escutando a porta ${PORT}.`)
    console.log(`PID: ${require('process').pid}: node`)
})