const passport = require("passport")
const {
    Person, Phone, Profession, Address, Media, SocialAccount, Uf, Municipio, Cbo, noCboProfession
} = require('../config/associations')
const { Op } = require('sequelize');

const bcrypt = require('bcrypt')
const saltRounds = 10

const controller = {}

controller.getRegisterPage = async (req, res) => {
    try {
        res.status(200).render('person/signup')
    } catch (error) {
        console.error(error)
        res.status(500).render("pages/error", { message: 'Erro interno' })
    }
}

controller.getLoginPage = async (req, res) => {
    try {
        res.status(200).render('person/login')
    } catch (error) {
        console.error(error)
        res.status(500).render("pages/error", { message: 'Erro interno' })
    }
}

controller.getLoginPageFail = async (req, res) => {
    try {
        const message = req.session.messages ? req.session.messages.at(-1) : null
        res.status(200).render('person/login', { message: message })
    } catch (error) {
        console.error(error)
        res.status(500).render("pages/error", { message: 'Erro interno' })
    }
}

controller.createPerson = async (req, res, next) => {
    const {
        city, state, // Municipio e Uf
        name, email, username, password, // Pessoa
    } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const uf = await Uf.findOne({
            where: {
                [Op.or]: [{ name: state }, { abbreviation: state }]
            }
        })
        if (!uf) {
            res.locals.messages.push("Selecione seu estado na lista")
        }
        const municipio = await Municipio.findOne({
            where: {
                [Op.and]: [{ name: city }, { Ufid: uf.id }]
            }
        })
        if (!municipio) {
            res.locals.messages.push(`A cidade "${city}" não consta na base de dados`)
        }
        const person = await Person.create({ name, email, username, hashedPassword, MunicipioId: municipio.id })
        if (person) {
            next() //vai para o login. conferir se nao vai informaçoes nao devidas
        } else {
            throw new Error("Erro ao cadastar usuário!\nUsuário não cadastrado");
        }
    } catch (error) {
        console.error(error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.fields['email']) {
                res.locals.messages.push(`O email "${error.fields['email']}" já está em uso`)
            }
            if (error.fields['username']) {
                res.locals.messages.push(`O nome de usuário "${error.fields['username']}" já está uso`)
            }
        }
        res.locals.messages.unshift("Ops! Usuário não cadastrado!")
        res.status(422).render("person/signup")
    }
}

// aqui não ha nenhuma informacao do usuario?
controller.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: `/user`,
        failureRedirect: '/loginFail',
        failureMessage: 'Usuário ou senha incorreto(s)!'
    })(req, res, next)
}

controller.getUser = async (req, res) => {
    try {
        const person = await Person.findByPk(req.user.id, {
            attributes: ['id', 'name',],
            include: {
                all: true,
                nested: true,
                attributes: { exclude: ['id', 'PersonId', 'MediaId', 'phoneMediaIds'] },
            },
            // raw: true
        });
        if (!person) {
            throw new Error("Ops! Usuário não encontrado");
        }
        console.log(JSON.stringify(person, null, 4))
        if (person.Professions.length > 0) {
            person.Professions.forEach(profession => {
                console.log(profession.Cbo.title);
            });
        }
        res.status(200).render('person/index', { person })
    } catch (error) {
        console.error(error);
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.createCard = async (req, res) => {
    const { profession, jobDescription, phone, link } = req.body
    try {
        // deveria vir do front-end
        const cbo = await Cbo.findAll({
            attributes: ['id'],
            where: { title: { [Op.or]: profession } },
            raw: true
        })

        let professionsBulk = []
        for (let i = 0; i < cbo.length; i++) {
            let row = {}
            // if (!profession[i]) {continue}
            // if (profession[i] == '') {continue}
            row['CboId'] = cbo[i]['id']
            row['PersonId'] = req.user.id
            if (jobDescription[i] != '') {
                row['jobDescription'] = jobDescription[i]
            }
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
            // // melhorar mandando um script com lista
            // let media = await Media.findOne({
            //     where:
            //         { platform: platform[i] }
            // })
            // if (!media) {
            //     media = await Media.create({ platform: platform[i] })
            // }
            // row['MediaId'] = media.id
            socialAccountsBulk.push(row)
        }

        const result = await Profession.bulkCreate(professionsBulk)
        if (result) {
            await Phone.bulkCreate(phonesBulk)
            await SocialAccount.bulkCreate(socialAccountsBulk)
        }

        res.redirect('/user')
    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.search = async (req, res) => {
    const { city, state, profession } = req.body

    try {
        const people = await Person.findAll({
            attributes: ['id', 'name',],
            include: [{ all: true }],
            where: {
                '$Cbo.title$': profession,
                '$Municipio.name$': city,
                [Op.or]: [{ '$Uf.name$': state }, { '$Uf.abbreviation$': state, }],
            }
        })
        res.render('pages/searchResults', { people: people }
        )
    } catch (error) {
        console.error(error);
        res.render('pages/error', { message: "Sua busca não encontrou resultados" })
    }
}

// Este pode ser mesclado com 'controller.search'
controller.getAll = async (req, res) => {

    try {
        /*
        const ufs = await Uf.findAll({ 
            raw: true,
            order: ['name']
        })
        
        const cbo = JSON.stringify(await Cbo.findAll())
        */
        const people = await Person.findAll({
            attributes: ['name',],
            include: [{ all: true }],
        })
        res.render('pages/index', { people: people,/* ufs: ufs,  cbo: cbo */ })
    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: "Erro interno" })
    }
}

module.exports = controller