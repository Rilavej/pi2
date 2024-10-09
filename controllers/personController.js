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
        res.status(500).render("pages/error", { error: "Erro ao carregar o formulário!" })
    }
}

controller.getLoginPage = async (req, res) => {
    try {
        res.status(200).render('person/login')
    } catch (error) {
        console.error(error)
        res.status(500).render("pages/error", { error: "Erro ao carregar o formulário!" })
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
    })(req, res, next)
}

controller.getUser = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.status(200).render('person/index', {user: req.user})
            return
        }
        res.render('pages/error', { message: 'Você precisa fazer login', error: null })
    } catch (err) {
        res.render('pages/error', {error: err, message: 'Erro interno'})
    }
}

controller.search = async (req, res) => {
    const { city, state, category } = req.body

    try {
        const card = await Person.findAll({
            attributes: ['name',],
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

        res.render('pages/index', { card: card }

        )
    } catch (error) {
        res.render('pages/error', { error: error, message: "Erro interno" })
    }
}

controller.createCard = async (req, res) => {
    const { phone, isWhatsApp, category, jobDescription, link, platform } = req.body
    res.send('ok')
}

module.exports = controller