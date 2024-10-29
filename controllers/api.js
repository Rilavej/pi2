// const { 
//     Person, Media, Phone, Profession, Address, SocialAccount, Cbo, Municipio, Uf
// } = require('../config/dbconnection').models

const { Sequelize } = require('sequelize')
const {
    Person, Media, Phone, Profession, Address, SocialAccount, Cbo, Municipio, Uf
} = require('../config/associations')

const controller = {}

controller.getProfessions = async function (req, res) {
    const professions = await Profession.findAll({
        include: {all: true},
        raw: true,
    })
    res.json(professions)
    console.log(professions)
}

controller.getCbo = async function () {
    try {
        const results = await Cbo.findAll()
        const cbo = await results.json() 
        res.status(200).json(cbo)    
    } catch (error) {
        console.error(error)
        res.status(500).send({cbo: ['Erro interno']})    
    }
}

module.exports = controller