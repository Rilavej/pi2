const sequelize = require('../config/dbconnection')

const Person = require('../model/person')
const Professional = require('../model/professional')
const Admin = require('../model/admin')
const Phone = require('../model/phone')
const State = require('../model/state')
const City = require('../model/city')
const Address = require('../model/address')
const SocialNetwork = require('../model/socialNetwork')
const SocialAccount = require('../model/socialAccounts')

// Isto é para ser herança. Verificar se esta correto
Person.hasOne(Admin, {onDelete: 'CASCADE'})
Admin.belongsTo(Person)

Person.hasOne(Professional, {onDelete: 'CASCADE'})
Professional.belongsTo(Person)
// 

Person.hasMany(Phone, {onDelete: 'CASCADE'})
Phone.belongsTo(Person)

Person.hasOne(Address, {onDelete: 'CASCADE'})
Address.belongsTo(Person)

Person.hasMany(SocialAccount, {onDelete: 'CASCADE'}) // Se não for "Professional" é "Person"
SocialAccount.belongsTo(Person)

SocialNetwork.hasMany(SocialAccount) // Se "{onDelete: 'CASCADE'}" ao deletar "SocialNetwork" deletará todas as pessoas com "SocialAccount" ?
SocialAccount.belongsTo(SocialNetwork)

State.hasMany(City)
City.belongsTo(State)

City.hasMany(Address)
Address.belongsTo(City)

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
sequelize.sync({force: true}) /** Remover opção {force: true } quando em produção */

module.exports = {Person, Professional, Admin, Phone, State, City, Address, SocialNetwork, SocialAccount}