const sequelize = require('../config/dbconnection')

const Person = require('../models/person')
const Professional = require('../models/professional')
const Admin = require('../models/admin')
const Phone = require('../models/phone')
const Profession = require('../models/profession')
const State = require('../models/state')
const City = require('../models/city')
const Address = require('../models/address')
const SocialNetwork = require('../models/socialNetwork')
const SocialAccount = require('../models/socialAccounts')

// Isto é para ser herança. Verificar se esta correto
Person.hasOne(Admin, {onDelete: 'CASCADE'})
Admin.belongsTo(Person)

Person.hasOne(Professional, {onDelete: 'CASCADE'})
Professional.belongsTo(Person)
// 

Person.hasMany(Phone, {onDelete: 'CASCADE'})
Phone.belongsTo(Person)

Person.hasMany(Profession, {onDelete: 'CASCADE'})
Profession.belongsTo(Person)

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
sequelize.sync({force: false})

module.exports = {Person, Professional, Admin, Phone, Profession, State, City, Address, SocialNetwork, SocialAccount}