const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Cbo = sequelize.define(
    'Cbo',
    {
        id: {
            type: DataTypes.INTEGER(6).ZEROFILL,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        tableName: "CBO",
        freezeTableName: true
    }
   
)

module.exports = Cbo