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

module.exports = controller