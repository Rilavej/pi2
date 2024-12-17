const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const NoCbo = sequelize.define(
    'NoCbo',
    {
        // id: {
        //     type: DataTypes.INTEGER(6).ZEROFILL,
        //     primaryKey: true,
        //     allowNull: false,
        // },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        tableName: "NoCBO",
        freezeTableName: true
    }
   
)

module.exports = NoCbo