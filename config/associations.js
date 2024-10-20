const sequelize = require('../config/dbconnection')

const Person = require('../models/person')
const Phone = require('../models/phone')
const Profession = require('../models/profession')
// const Location = require('../models/location')
const Address = require('../models/address')
const Media = require('../models/media')
const SocialAccount = require('../models/socialAccount')
const Cbo = require('../models/cbo')
const Municipio = require('../models/municipio')
const Uf = require('../models/uf')

// Location.hasMany(Person)
// Person.belongsTo(Location)

Uf.hasMany(Municipio)
Municipio.belongsTo(Uf)

Municipio.hasMany(Person)
Person.belongsTo(Municipio)

Person.belongsToMany(Cbo, {through: Profession})
Cbo.belongsToMany(Person, {through: Profession})

Person.hasMany(Phone, {onDelete: 'CASCADE'})
Phone.belongsTo(Person)

// Person.hasMany(Profession, {onDelete: 'CASCADE'})
// Profession.belongsTo(Person)

Person.hasMany(SocialAccount, {onDelete: 'CASCADE'})
SocialAccount.belongsTo(Person)

Person.hasOne(Address, {onDelete: 'CASCADE'})
Address.belongsTo(Person)

Media.hasMany(SocialAccount, {foreignKey: 'MediaId', onDelete: 'CASCADE'})
SocialAccount.belongsTo(Media, {foreignKey: 'MediaId'})

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
sequelize.sync({force: false})

module.exports = {
    Person,
    Phone,
    Profession,
    // Location,
    Address,
    Media,
    SocialAccount,
    Cbo
}