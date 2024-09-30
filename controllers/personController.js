const {
    Person, 
    Professional, 
    Admin, 
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
        res.status(200).render('person/form', /*{person: new Person()}*/)
    } catch (error) {

    }
}

controller.create = async (req, res)=> {
    const {
        name, surname, email, username, password, // Pessoa
        contactNumber, professionName, jobDescription, // Phone
        street, houseNumber, complement, // Address
        link, // SocialAccount
        socialNetworkName, // SocialNetwork
        stateStateAbbreviation, // State
        cityCityName, // City
    } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds) 
        const person = await Person.create({name, surname, email, username, hashedPassword})
        Phone.create({contactNumber, professionName, jobDescription, personId: person.id})
        const address = await Address.create({street, houseNumber, complement, personId: person.id, cityCityName, stateStateAbbreviation})

        const socialNetwork = await SocialNetwork.create({socialNetworkName})
        const socialAccounts = await SocialAccount.create({link, personId: person.id, SocialNetworkSocialNetworkName: socialNetwork.socialNetworkName})
        State.create({stateAbbreviation})
        City.create({cityName})
        
    } catch (error) {

    }
}

module.exports = controller