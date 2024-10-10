const passport = require("passport")
const {
    Person,
    Phone,
    Profession,
    Location,
    Address,
    PDigital,
    SocialAccount,
} = require('../config/associations')

const bcrypt = require('bcrypt')
const saltRounds = 10

const controller = {}

controller.getRegisterPage = async (req, res) => {
    try {
        // Talvez const person = Person.bild() ou nenhum dos dois
        //https://sequelize.org/docs/v6/core-concepts/model-instances/#creating-an-instance
        // const state = State.findAll({
        //     order: ['stateAbbreviation' ,'DESC']
        // })
        // const city = City.findAll()
        res.status(200).render('person/signup', {
            // state: state,
            // city: city
        })
    } catch (error) {
        console.error(error)
        res.status(500).render(
            "pages/error", { error: "Erro ao carregar o formulário!", message: 'Erro interno' }
        )
    }
}

controller.getLoginPage = async (req, res) => {
    try {
        const message = req.session.messages.at(-1) || null
        console.log(typeof(req.session.messages))
        console.log(req.session.messages)
        console.log(JSON.stringify(req.session.messages))
        res.status(200).render('person/login', {message: message})
    } catch (err) {
        console.error(err)
        res.status(500).render(
            "pages/error", { err: "Erro ao carregar o formulário!", message: 'Erro interno' }
        )
    }
}

controller.createPerson = async (req, res, next) => {
    const {
        city, state, // Location
        name, email, username, password, // Pessoa
    } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        let location = await Location.findOne({ where: { city: city, state: state } })
        if (!location) {
            location = await Location.create({ city, state })
        }
        const person = await Person.create({ name, email, username, hashedPassword, LocationId: location.id })

        next() //vai para o login. conferir se nao vai informaçoes nao devidas

    } catch (error) {
        console.error(error)
        res.status(422).render("pages/error", { message: `Erro ao cadastar usuário!`, error: error })
    }
}

// aqui não ha nenhuma informacao do usuario?
controller.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: `/user`,
        failureRedirect: '/login',
        failureMessage: true, // subtitua o true por "Usuário ou senha incorretos!"
    })(req,res,next)
}

controller.getUser = async (req, res) => {
    try {
        const person = await Person.findByPk(req.user.id, {
            attributes: ['id','name',],
            include: { 
                all: true, 
                nested: true,
                attributes: {exclude: 'id'},
            },
        });
        res.status(200).render('person/index', { person })
    } catch (err) {
        console.error(err);
        res.render('pages/error', {message: 'Erro interno', error: err})
    }
}

controller.search = async (req, res) => {
    const { city, state, category } = req.body

    try {
        const card = await Person.findAll({
            attributes: ['id','name',],
            include: [{ all: true }],
            where: {
                '$Location.city$': city,
                '$Location.state$': state,
                '$Professions.category$': category
            }
        })
        res.render('pages/searchResults', { card: card }
        )
    } catch (error) {
        res.render('pages/error', { error: error, message: "Sua busca não encontrou resultados" })
    }
}

// Este pode ser mesclado com 'controller.search'
controller.getAll = async (req, res) => {
    const { city, state, category } = req.body

    try {
        const card = await Person.findAll({
            attributes: ['name',],
            include: [{ all: true }],
            // where:{
            //     '$Location.city$': city,
            //     '$Location.state$': state,
            //     '$Professions.category$': category
            // }
        })
        res.render('pages/index', { card: card })
    } catch (error) {
        res.render('pages/error', { error: error, message: "Erro interno" })
    }
}

controller.createCard = async (req, res) => {
    const { phone, isWhatsApp, category, jobDescription, link, platform } = req.body
    // const person = await Person.findByPk(req.user.id)
    try {
        await Phone.create({ phone: phone, PDIgitalId: isWhatsApp })
        await Profession.create({ category: category, jobDescription: jobDescription })
        await PDigital.create({ link: link, PDigitalId: platform })
        res.redirect('/user')
    } catch (error) {
        res.render('pages/error', { message: 'Erro interno', error: error })
    }
}

module.exports = controller