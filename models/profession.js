const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Profession = sequelize.define(
    'Profession',
    {
        jobDescription: {
            type: DataTypes.STRING,
        },
        // Campo reservado para possíveis ocupações inexistentes no CBO
        newCategory: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    }
)

module.exports = Profession