const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const SocialAccount = sequelize.define(
    'SocialAccount',
    {
        link: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        // SocialNetworkName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     references: {model: 'SocialNetwork', key: 'SocialNetworkName'},
        //     onDelete: 'CASCADE',
        // },
        // personId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {model: 'Person', key: 'personId'},
        //     onDelete: 'CASCADE',
        // }
    },
    {
        // tableName: 'socialAccount'
    }
)

module.exports = SocialAccount