const passport = require("passport")
const {
    Person,
    Phone,
    Profession,
    Location,
    Address,
    Media,
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
    } catch (err) {
        console.error(err)
        res.status(500).render(
            "pages/error", { err: "Erro ao carregar o formulário!", message: 'Erro interno' }
        )
    }
}

controller.getLoginPage = async (req, res) => {
    try {
        res.status(200).render('person/login', {message: null})
    } catch (err) {
        console.error(err)
        res.status(500).render(
            "pages/error", { err: "Erro ao carregar o formulário!", message: 'Erro interno' }
        )
    }
}

controller.getLoginPageFail = async (req, res) => {
    try {
        const message = req.session.messages? req.session.messages.at(-1) : null
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

    } catch (err) {
        console.error(err)
        res.status(422).render("pages/error", { message: `Erro ao cadastar usuário!`, err: err })
    }
}

// aqui não ha nenhuma informacao do usuario?
controller.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: `/user`,
        failureRedirect: '/loginFail',
        failureMessage: 'Usuário ou senha incorreto(s)!'
    })(req,res,next)
}

controller.getUser = async (req, res) => {
    try {
        const person = await Person.findByPk(req.user.id, {
            attributes: ['id','name',],
            include: {
                all: true, 
                nested: true,
                attributes: {exclude: ['id', 'PersonId', 'MediaId', 'phoneMediaIds']},
            },
        });
        res.status(200).render('person/index', { person })
    } catch (err) {
        console.error(err);
        res.render('pages/error', {message: 'Erro interno', err: err})
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
    } catch (err) {
        res.render('pages/error', { err: err, message: "Sua busca não encontrou resultados" })
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
    } catch (err) {
        res.render('pages/error', { err: err, message: "Erro interno" })
    }
}

controller.createCard = async (req, res) => {
    const {category, jobDescription, phone, link, platform} = req.body
    try {
        let professionsBulk = []
        for (let i = 0; i < category.length; i++) {
            let row = {}
            if (category[i] == '') {continue}
            row['category'] = category[i]
            row['PersonId'] = req.user.id
            if (jobDescription[i] != '') {
                row['jobDescription'] = jobDescription[i]}
            professionsBulk.push(row)
        }

        // Assumindo que todo telefone é whatsapp
        let phonesBulk = []
        for (let i = 0; i < phone.length; i++) {
            let row = {}
            row['phone'] = phone[i]
            row['PersonId'] = req.user.id
            phonesBulk.push(row)
        }

        let socialAccountsBulk = []
        for (let i = 0; i < link.length; i++) {
            let row = {}
            row['link'] = link[i]
            row['PersonId'] = req.user.id
            // melhorar mandando um script com lista
            let media = await Media.findOne({ 
                where: 
                    { platform: platform[i] }
                })
            if (!media) {
                media = await Media.create({platform: platform[i]})
            }
            row['MediaId'] = media.id
            socialAccountsBulk.push(row)
        }

        await Profession.bulkCreate(professionsBulk)
        await Phone.bulkCreate(phonesBulk)
        await SocialAccount.bulkCreate(socialAccountsBulk)
        res.redirect('/user')
    } catch (err) {
        res.render('pages/error', { message: 'Erro interno', err: err })
    }
}

module.exports = controller