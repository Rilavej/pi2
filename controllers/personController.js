const {
    Person, 
    //Professional, 
    //Admin, 
    Phone, 
    Profession, 
    State, 
    City, 
    Address, 
    SocialNetwork, 
    SocialAccount
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

controller.create = async (req, res)=> {
    const {
        name, surname, email, username, password, // Pessoa
        contactNumber, // Phone
        professionName, jobDescription, // Profession
        street, houseNumber, complement, // Address
        link, // SocialAccount
        socialNetworkName, // SocialNetwork 
        stateAbbreviation, // State
        cityName, // City
    } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        const person = await Person.create({name, surname, email, username, hashedPassword})
        Phone.create({contactNumber, PersonId: person.id})
        Profession.create({professionName, jobDescription, PersonId: person.id})
        
        // provisorio. Até cidades e estados estarem cadastrados no banco
        await State.create({stateAbbreviation})
        await City.create({cityName, StateStateAbbreviation: stateAbbreviation})
        //
        const city = await City.findOne({where: {CityName: cityName}})
        Address.create({street, houseNumber, complement, PersonId: person.id, CityId: city.id})

        const socialNetwork = await SocialNetwork.create({socialNetworkName})
        SocialAccount.create({link, PersonId: person.id, SocialNetworkId: socialNetwork.id})
        
    } catch (error) {
        console.error(error)
        res.status(422).render("pages/error", { error: "Erro ao cadastar usuário!" + error })
    }
    
    res.status(200).redirect('/login')
}

module.exports = controller