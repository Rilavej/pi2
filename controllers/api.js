const { Sequelize } = require('sequelize')
const {
    Person, Media, Phone, Service, Address, SocialAccount, Cbo, Municipio, Uf, NoCboService
} = require('../config/associations')

const controller = {}

controller.getProfessions = async function (req, res) {
    const services = await Service.findAll({
        include: { all: true },
        raw: true,
    })
    res.json(services)
    console.log(services)
}

module.exports = controller