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

controller.getRegisterPage = async (req, res)=> {
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

controller.getLoginPage = async (req, res)=> {
    try {
        res.status(200).render('person/login')
    } catch (error) {
        console.error(error)
        res.status(500).render("pages/error", { error: "Erro ao carregar o formulário!" })
    }
}

controller.createPerson = async (req, res)=> {
    const {
        city, state, // Location
        name, email, username, password, // Pessoa
    } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        let location = await Location.findOne({where: {city: city, state: state}})
        if (!location) {
            location = await Location.create({city, state})
        }
        const person = await Person.create({name, email, username, hashedPassword, LocationId: location.id})
        
        res.status(200).redirect('/login')

    } catch (error) {
        console.error(error)
        res.status(422).render("pages/error", { message: `Erro ao cadastar usuário!`, error: error})
    }
}

controller.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: `/user`,
        failureRedirect: '/login', 
    })(req, res, next)
}

controller.getUser = async (req, res) => {
    res.status(200).render('person/index')
}

module.exports = controller