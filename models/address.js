const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Address = sequelize.define(
    'Address',
    {   
        street: {
            type: DataTypes.STRING,
        },
        houseNum: {
            type: DataTypes.STRING,
        },
        complement: {
            type: DataTypes.STRING,
        },
        // cityName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     references: {model: 'City', key: 'cityName'},
        //     onDelete: 'CASCADE',
        // },
        // stateName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     references: {model: 'State', key: 'stateName'},
        //     onDelete: 'CASCADE',
        // },
        // personId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {model: 'Person', key: 'personId'},
        //     onDelete: 'CASCADE',
        // },
        
    },
    {
        // tableName: 'address'
    }
)

module.exports = Address