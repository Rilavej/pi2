const passport = require("passport")
const {
    Person, Phone, Service, Address, Media, SocialAccount, Uf, Municipio, Cbo, noCboService
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
            res.locals.messages.unshift("Erro ao cadastar usuário!\nUsuário não cadastrado")
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
        res.status(422).render("person/signup", { message: 'Erro interno' })
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

controller.getPersonOrCard = async (req, res, next) => {
    try {
        const person = await Person.findByPk(req.user.id, {
            attributes: ['id', 'name',],
            include: {
                all: true,
                nested: true,
                // attributes: { exclude: ['id', 'PersonId', 'MediaId', 'phoneMediaIds'] },
            },
            // raw: true
        });
        if (!person) {
            res.locals.messages.push("Usuário não encontrado")
            throw new Error("Usuário não encontrado");
        }
        res.person = person
        next() //showCard

    } catch (error) {
        console.error(error);
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.showCard = (req, res) => {
    try {
        res.status(200).render('person/index', { person: res.person })
    } catch (error) {
        console.log(error);
        res.render('pages/error', { message: 'Erro interno' })

    }
}

controller.getEditCardPage = (req, res) => {
    try {
        res.status(200).render('person/edit', { person: res.person })
    } catch (error) {
        console.log(error);
        res.render('pages/error', { message: 'Erro interno' })
    }
}

// Implemetar limite em quantidade de informações nos cartões por usuario 
controller.createCard = async (req, res, next) => {
    const { services, phones, links } = req.body

    console.log(services, 'post do formulario'); // retirar

    try {
        // opção 1
        // const cbo = await Cbo.findAll({
        //     attributes: ['id'], /** talvez trazer do front-end em input type='hidden' */
        //     where: { title: { [Op.or]: services /** era uma lista simples */ } },
        //     raw: true
        // })

        // fazer função para usar em outros controllers
        for (const service of services) {
            service.ocupation = service.ocupation.trim().toLowerCase()
            service.description = service.description.trim().toLowerCase()
            service.ocupation = service.ocupation.charAt(0).toUpperCase() + service.ocupation.slice(1)
            service.description = service.description.charAt(0).toUpperCase() + service.description.slice(1)
        }
        console.log(services, 'services tratado'); // retirar

        const serviceBulk = [];
        const noCboServiceBulk = [];
        const invalidBulk = [];

        // opção 2
        for (const service of services) {
            const cbo = await Cbo.findOne({
                attributes: ['id'], /** talvez trazer do front-end em input type='hidden' */
                where: { title: service.ocupation.trim() },
                raw: true
            })
            console.log(cbo, "resultado da consulta"); // retirar

            if (cbo) {
                serviceBulk.push({ CboId: cbo.id, description: service.description, PersonId: req.user.id })
            } else if (service.ocupation === "" || service.ocupation === null) {
                invalidBulk.push({ title: service.ocupation, description: service.description })
                res.locals.messages.push(`Descrição "${service.description}" associada à profissão inválida: "${service.title}"`)
            } else {
                noCboServiceBulk.push({ title: service.ocupation, description: service.description, PersonId: req.user.id })
            }
        }
        console.log(serviceBulk, 'serviceBulk')
        console.log(noCboServiceBulk, 'noCboServiceBulk')
        console.log(invalidBulk, 'invalidBulk');

        // opção 1
        // let professionsBulk = []
        // for (let i = 0; i < cbo.length; i++) {
        //     let row = {}
        //     row['CboId'] = cbo[i]['id']
        //     row['PersonId'] = req.user.id
        //     if (description[i] != '') {
        //         row['description'] = description[i]
        //     }
        //     professionsBulk.push(row)
        // }

        // Assumindo que todo telefone é whatsapp

        function isNumeric(str) {
            return /^[0-9]+$/.test(str);
        }

        const phonesBulk = []
        const invalidPhones = []

        for (let i = 0; i < phones.length; i++) {
            if (!phones[i]) continue
            phones[i] = phones[i].trim()
            if (phones[i] === '') continue
            if (!isNumeric(phones[i])) {
                invalidPhones.push(phones[i])
                res.locals.messages.push(`Telefone inválido: "${phones[i]}"`)
                continue
            }
            const row = {}
            row['phone'] = phones[i]
            row['PersonId'] = req.user.id
            phonesBulk.push(row)
        }
        console.log(phonesBulk, 'phonesBulk');
        console.log(invalidPhones, 'invalidPhones');

        const socialAccountsBulk = []

        for (let i = 0; i < links.length; i++) {
            if (!links[i]) continue
            links[i] = links[i].trim().toLowerCase()
            if (links[i] === '') continue
            const row = {}
            row['link'] = links[i]
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
        console.log(socialAccountsBulk, 'socialAccountsBulk');

        if (serviceBulk.length > 0) {
            if (!await Service.bulkCreate(serviceBulk)) res.locals.messages.push('Erro ao salvar Profisão')
        } if (noCboServiceBulk.length > 0) {
            if (!await Service.bulkCreate(noCboServiceBulk)) res.locals.messages.push('Erro ao salvar Profisão')
        } if (phonesBulk.length > 0) {
            if (!await Phone.bulkCreate(phonesBulk)) res.locals.messages.push('Erro ao salvar telefone')
        } if (socialAccountsBulk.length > 0) {
            if (!await SocialAccount.bulkCreate(socialAccountsBulk)) res.locals.messages.push('Erro ao salvar conta social')
        }

        next()
    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno', messages: res.locals.messages })
    }
}

controller.deleteCard = async (req, res, next) => {
    await Service.destroy({
        where: {
            PersonId: req.user.id
        }
    });

    await Phone.destroy({
        where: {
            PersonId: req.user.id
        }
    });

    await SocialAccount.destroy({
        where: {
            PersonId: req.user.id
        }
    });

    next()
}




controller.search = async (req, res) => {
    const { city, state, service } = req.body

    try {
        const people = await Person.findAll({
            attributes: ['id', 'name',],
            include: [{ all: true }],
            where: {
                '$Cbo.title$': service,
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