const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Media = sequelize.define(
    'Media',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        platform: {
            type: DataTypes.STRING,
            unique: true
        }
    },
    {
        tableName: 'Media',
        freezeTableName: true
    }
)

module.exports = Media