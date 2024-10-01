const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Phone = sequelize.define(
    'Phone',
    {
        contactNumber: {
            type: DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        // personId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: 'Person',
        //         key: 'personId',
        //     },
        //     onDelete: 'CASCADE',
        // }
    },
    {
        // tableName: 'phone'
    }
)

module.exports = Phone