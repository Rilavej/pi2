const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Person = sequelize.define(
    'Person', // Nome do modelo e não da tabele. Na ausência do nome da tabela, está receberá o mesmo nome do modelo.
    {
        // personId: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true,
        // },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'person'
    }
)

module.exports = Person