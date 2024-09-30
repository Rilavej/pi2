const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

// "Profession" pode subtituir "Professional" permitindo que uma pessoa tenha varias profissoes em unico cadastro
const Profession = sequelize.define(
    'Profession',
    {
        professionName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jobDescription: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "profession"
    }
   
)

module.exports = Profession