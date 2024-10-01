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
            validate: {
                isAlpha: true,            
            }
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isAlpha: true,            
            // }
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        hashedPassword:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Se o modelo Admin não der certo
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        // tableName: 'person'
    }
)

module.exports = Person