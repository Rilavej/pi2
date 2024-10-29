const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Municipio = sequelize.define(
    'Municipio', {
        id: {
            type: DataTypes.INTEGER(7).ZEROFILL,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
)

module.exports = Municipio