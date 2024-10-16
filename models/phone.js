const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')
const Media = require('./media')

const Phone = sequelize.define(
    'Phone',
    {
        phone: {
            type: DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        // MediaId: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: "Media",
        //         key: 'id'
        //     }
        // }
    },
    {
        // tableName: 'phone'
    }
)

module.exports = Phone