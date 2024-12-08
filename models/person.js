const sequelize = require('../config/dbconnection')
const DataTypes = require('sequelize')

const Person = sequelize.define(
    'Person', // Nome do modelo e não da tabele. Na ausência do nome da tabela, está receberá o mesmo nome do modelo.
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isAlpha: true,            
            // }
        },
        // surname: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
            // validate: {
            //     isAlpha: true,            
            // }
        // },
        username:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            // validate: {
            //     isEmail: true,
            // }
        },
        hashedPassword:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        // Se o modelo Admin não der certo
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        imageName: {
            type: DataTypes.STRING,
        }
    },
    {
        // tableName: 'person'
    }
)

module.exports = Person