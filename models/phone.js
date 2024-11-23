const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')
const Media = require('./media')

const Phone = sequelize.define(
    'Phone',
    {
        phone: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        // Padrao para códigos de midia "-x-y-z-",onde x,y,z são ids da tabela media
        // Implemetar get e set presonalizados
        mediaIdsComment: {
            type: DataTypes.STRING,
            comment: 'Padrão para códigos de mídia: "-x-y-z-". Onde "x", "y" e "z" são ids da tabela media'
        }
    },
    {
        // tableName: 'phone'
    }
)

module.exports = Phone