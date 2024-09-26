const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const RedeSocial = sequelize.define(
    'RedeSocial',
    {
        nome_rede_social: {
            type: DataTypes.STRING,
            primaryKey: true,
            //allowNull: false,
        }
    },
    {tableName: 'redeSocial'}
)

module.exports = RedeSocial