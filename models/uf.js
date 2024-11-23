const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Uf = sequelize.define(
    'Uf',{
        id: {
            type: DataTypes.INTEGER(2).ZEROFILL, 
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        abbreviation: {
            type: DataTypes.ENUM,
            unique: true,
            allowNull: false,
            values: [
                "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
                "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
                "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
              ]
        }
    },
    {
        tableName: 'UF',
        freezeTableName: true,
    }
)

module.exports = Uf
