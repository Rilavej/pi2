const passport = require("passport")
const {
    Person, Phone, Service, Address, Media, SocialAccount, Uf, Municipio, Cbo, NoCboService
} = require('../config/associations')
const { Op, or, Sequelize } = require('sequelize');

const bcrypt = require('bcrypt')
const saltRounds = 10
const Fuse = require('fuse.js');

const controller = {}

function trimServices(services) {
    for (const service of services) {
        if (service.ocupation) {
            service.ocupation = service.ocupation.trim().toLowerCase()
            service.ocupation = service.ocupation.charAt(0).toUpperCase() + service.ocupation.slice(1)
        }
        if (service.description) {
            service.description = service.description.trim().toLowerCase()
            service.description = service.description.charAt(0).toUpperCase() + service.description.slice(1)
        }
    }
}

function isNumeric(str) {
    return /^[0-9]+$/.test(str);
}

controller.getRegisterPage = async (req, res) => {
    try {
        const ufs = await Uf.findAll({ raw: true, order: ['name'] })
        const cbo = await Cbo.findAll({ raw: true })
        res.status(200).render('person/signup', { ufs: ufs, cbo: cbo })
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
    let {
        city, state, // Municipio e Uf
        name, email, username, password, // Pessoa
    } = req.body

    name = name.trim().toLowerCase()
    name = name.charAt(0).toUpperCase() + name.slice(1)
    email = email.trim().toLowerCase()
    username = username.trim().toLowerCase()

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

controller.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        // req.flash('success_msg', "Você saiu!")
        res.redirect('/')
    })

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
        console.log(JSON.stringify(person, null, 4), "person");
        next() //showCard

    } catch (error) {
        console.error(error);
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.showCard = (req, res) => {
    try {
        res.status(200).render('person/index', { person: res.person, messages: res.locals.messages })
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

    console.log(services, "services"); // retirar
    console.log(phones, "phones"); // retirar
    console.log(links, "links"); // retirar

    try {
        if (services) {
            trimServices(services) // retira espaços do incio e fim, lowerCase a string e capitaliza primera letra
            console.log(services, 'services tratado'); // retirar

            const serviceBulk = [];
            const noCboServiceBulk = [];
            const invalidBulk = [];

            for (const service of services) {
                if (service.ocupation === "" || service.ocupation === null) {
                    invalidBulk.push({ title: service.ocupation, description: service.description })
                    continue
                    // res.locals.messages.push(`Descrição "${service.description}" associada à profissão inválida: "${service.title}"`)
                }
                const cbo = await Cbo.findOne({
                    attributes: ['id'], /** talvez trazer do front-end em input type='hidden' */
                    where: { title: service.ocupation },
                    raw: true
                })
                console.log(cbo, "resultado da consulta"); // retirar

                if (cbo) {
                    serviceBulk.push({ CboId: cbo.id, description: service.description, PersonId: req.user.id })
                } else {
                    noCboServiceBulk.push({ title: service.ocupation, description: service.description, PersonId: req.user.id })
                }
            }
            console.log(serviceBulk, 'serviceBulk')
            console.log(noCboServiceBulk, 'noCboServiceBulk')
            console.log(invalidBulk, 'invalidBulk');

            if (serviceBulk.length > 0) {
                if (!await Service.bulkCreate(serviceBulk)) res.locals.messages.push('Erro ao salvar Profisão')
            }
            if (noCboServiceBulk.length > 0) {
                if (!await NoCboService.bulkCreate(noCboServiceBulk)) res.locals.messages.push('Erro ao salvar Profisão')
            }
        }

        if (phones) {
            // Assumindo que todo telefone é whatsapp
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

            if (phonesBulk.length > 0) {
                if (!await Phone.bulkCreate(phonesBulk)) res.locals.messages.push('Erro ao salvar telefone')
            }
        }

        if (links) {
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

            if (socialAccountsBulk.length > 0) {
                try {
                    const result = await SocialAccount.bulkCreate(socialAccountsBulk)
                    if (!result) res.locals.messages.push('Erro ao salvar conta social')
                } catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        res.locals.messages.push(`A conta social "${error.fields.PRIMARY}" já está vinculada a um usuário`)
                    }
                }

            }
        }

        next()

    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno', messages: res.locals.messages })
    }
}

controller.updateServices = async (req, res) => {
    const { services, noCboServices } = req.body

    console.log(services, "services");
    console.log(noCboServices, 'noCboServices');

    try {

        if (services) {
            trimServices(services)
            console.log(services, 'services tratado'); // retirar

            const service = services[0]

            if (service.ocupation === "" || service.ocupation === null) {
                res.locals.messages.push(`Descrição "${service.description}" associada à profissão inválida: "${service.title}"`)
                throw new Error(`Descrição "${service.description}" associada à profissão inválida: "${service.title}"`);
            }

            console.log(service.ocupation, "ocupacao");

            const cbo = await Cbo.findOne({
                attributes: ['id'], /** trazer do front-end em input type='hidden' */
                where: { title: service.ocupation },
                raw: true
            })
            console.log(cbo, "resultado da consulta"); // retirar

            if (cbo) {
                await Service.update(
                    { CboId: cbo.id, description: service.description, },
                    {
                        where: {
                            PersonId: req.user.id,
                            id: service.id
                        },
                    },
                );

            } else {
                const result = await NoCboService.create({ title: service.ocupation, description: service.description, PersonId: req.user.id })
                if (result) {
                    await Service.destroy({
                        where: {
                            PersonId: req.user.id,
                            id: service.id
                        }
                    });
                } else {
                    res.locals.messages.push(`Descrição "${service.description}" associada à profissão inválida: "${service.title}"`)
                }
            }
        }

        if (noCboServices) {
            trimServices(noCboServices)
            console.log(noCboServices, 'service tratado'); // retirar

            const noCboService = noCboServices[0]

            if (noCboService.ocupation === "" || noCboService.ocupation === null) {
                res.locals.messages.push(`Descrição "${noCboService.description}" associada à profissão inválida: "${noCboService.title}"`)
                throw new Error(`Descrição "${noCboService.description}" associada à profissão inválida: "${noCboService.title}"`);
            }

            const result = await NoCboService.update(
                { title: noCboService.ocupation, description: noCboService.description, },
                {
                    where: {
                        PersonId: req.user.id,
                        id: noCboService.id
                    },
                },
            );

            if (!result) {
                res.locals.messages.push(`Descrição "${noCboService.description}" associada à profissão inválida: "${noCboService.title}"`)
            }
        }

        res.redirect('/user/edit')

    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno', messages: res.locals.messages })
    }
}

controller.updatePhone = async (req, res) => {
    const { phones } = req.body
    let { phone } = phones[0]
    const { id } = phones[0]

    try {
        if (phone)
            phone = phone.trim()
        if (phone === '') {
            res.locals.messages.push("Telefone inválido")
            throw new Error(res.locals.messages.at(-1));
        }

        if (!isNumeric(phone)) {
            res.locals.messages.push(`Telefone inválido: "${phone}"`)
            throw new Error(res.locals.messages.at(-1));
        }

        const result = await Phone.update(
            { phone: phone },
            {
                where: {
                    PersonId: req.user.id,
                    id: id
                },
            },
        );
        if (!result) {
            res.locals.messages.push(`Não foi possível atualizar o telefone: "${phone}"`)
            throw new Error(res.locals.messages.at(-1));

        }

        res.redirect('/user/edit')

    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno', messages: res.locals.messages })
    }
}

controller.updateSocialAccount = async (req, res) => {
    const { links } = req.body
    let { link } = links[0]
    const { oldLink } = links[0]

    try {

        if (link)
            link = link.trim()
        if (link === '') {
            res.locals.messages.push("Conta Social inválida")
            throw new Error(res.locals.messages.at(-1));
        }

        const result = await SocialAccount.update(
            { link: link },
            {
                where: {
                    PersonId: req.user.id,
                    link: oldLink
                },
            },
        );
        if (!result) {
            res.locals.messages.push(`Não foi possível atualizar a Conta Social: "${link}"`)
            throw new Error(res.locals.messages.at(-1));

        }

        res.redirect('/user/edit')

    } catch (error) {
        console.error(error)
        res.render('pages/error', { message: 'Erro interno', messages: res.locals.messages })
    }
}

controller.deleteService = async (req, res) => {
    try {
        await Service.destroy({
            where: {
                PersonId: req.user.id,
                id: req.params.id
            }
        });

        res.redirect('/user/edit')

    } catch (error) {
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.deleteNoCboService = async (req, res) => {
    try {
        await NoCboService.destroy({
            where: {
                PersonId: req.user.id,
                id: req.params.id
            }
        });

        res.redirect('/user/edit')

    } catch (error) {
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.deletePhone = async (req, res) => {
    try {
        await Phone.destroy({
            where: {
                PersonId: req.user.id,
                id: req.params.id
            }
        });

        res.redirect('/user/edit')

    } catch (error) {
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.deleteSocialAccount = async (req, res) => {

    try {
        await SocialAccount.destroy({
            where: {
                PersonId: req.user.id,
                link: decodeURIComponent(req.query.link)
            }
        });

        res.redirect('/user/edit')

    } catch (error) {
        res.render('pages/error', { message: 'Erro interno' })
    }
}

controller.search = async (req, res) => {
    const { city, state, service } = req.body

    try {
        const people = await Person.findAll({
            attributes: ['id', 'name', 'username', 'MunicipioId'],
            where: {
                [Op.and]: [
                    { '$Municipio.name$': city },
                    { [Op.or]: [{ '$Municipio.Uf.name$': state }, { '$Municipio.Uf.abbreviation$': state, }] },
                ]
            },
            include: { all: true, nested: true },
        })
        const peopleFromJson = people.map((person) => person.toJSON())
        // let peopleFromJson = JSON.stringify(people)
        // peopleFromJson = JSON.parse(peopleFromJson)
        
        const fuseOptions = {
            // isCaseSensitive: false,
            // includeScore: false,
            // shouldSort: true,
            // includeMatches: false,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            // threshold: 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,
            keys: ["Cbos.title", "NoCboServices.title"]
        }
        const fuse = new Fuse(peopleFromJson, fuseOptions)
        const peopleFromFuse = await fuse.search(service.trim().toLowerCase())
        const filteredPeople = peopleFromFuse.map( x => x.item )

        // // Filtro estrito atraveis da cláusula WHERE
        // const people = await Person.findAll({
        //     attributes: ['id', 'name', 'username', 'MunicipioId'],
        //     where: {
        //         [Op.and]: [
        //             { [Op.or]: [{ '$Cbos.title$': service }, { '$NoCboServices.title$': service }] },
        //             { '$Municipio.name$': city },
        //             { [Op.or]: [{ '$Municipio.Uf.name$': state }, { '$Municipio.Uf.abbreviation$': state, }] },
        //         ]
        //     },
        //     include: { all: true, nested: true },
        // })

        // // Filtro estrito atraveis da cláusula WHERE
        // const people = await Person.findAll({
        //     attributes: ['id', 'name', 'username', 'MunicipioId'],
        //     include: [
        //         {
        //             model: Municipio,
        //             where: {
        //                 name: city,
        //             },
        //             include: {
        //                 model: Uf,
        //                 where: {
        //                     [Op.or]: [{ name: state }, { abbreviation: state }]
        //                 }
        //             }
        //         },
        //         {
        //             model: Cbo,
        //             // where: { title: service },
        //             // required: false,
        //             // or: true,

        //         },
        //         {
        //             model: NoCboService,
        //             // where: { title: service },
        //             // required: false,
        //             // or: true,
        //         },
        //         { model: SocialAccount, },
        //         { model: Phone, }
        //     ],
        //     where: {
        //         [Op.or]: [
        //             { '$Cbos.title$': service }, // Condição para o título em Cbo
        //             { '$NoCboServices.title$': service } // Condição para o título em NoCboService
        //         ]
        //     }
        // })

        console.log(filteredPeople, "=== filteredPeople");
        if (filteredPeople.length === 0) res.locals.messages.push("Sua busca não retornou resultados!")
        res.locals.inputValues = {city: city, state: state, service: service.trim()}
        
        res.render('pages/searchResults', { people: filteredPeople, messages: res.locals.messages, inputValues: res.locals.inputValues })
    } catch (error) {
        console.error(error);
        res.render('pages/error', { message: "Erro interno" })
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