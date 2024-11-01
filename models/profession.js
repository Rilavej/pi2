const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Profession = sequelize.define(
    'Profession',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        jobDescription: {
            type: DataTypes.STRING,
        },
    }
)

module.exports = Profession