const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const City = sequelize.define(
    'City',
    {
        cityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // stateName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     references: {
        //         model: 'State',
        //         key: 'stateName'
        //     },
        //     onDelete: 'CASCADE'
        // }
    },
    {
        // tableName: 'city'
    }
)

module.exports = City