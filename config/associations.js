const sequelize = require('../config/dbconnection')

const Person = require('../models/person')
const Phone = require('../models/phone')
const Profession = require('../models/profession')
const Location = require('../models/location')
const Address = require('../models/address')
const PDigital = require('../models/pDigital')
const SocialAccount = require('../models/socialAccount')

Location.hasMany(Person)
Person.belongsTo(Location)

Person.hasMany(Phone, {onDelete: 'CASCADE'})
Phone.belongsTo(Person)

Person.hasMany(Profession, {onDelete: 'CASCADE'})
Profession.belongsTo(Person)

Person.hasMany(SocialAccount, {onDelete: 'CASCADE'})
SocialAccount.belongsTo(Person)

Person.hasOne(Address, {onDelete: 'CASCADE'})
Address.belongsTo(Person)

PDigital.hasMany(SocialAccount)
SocialAccount.belongsTo(PDigital)

PDigital.hasMany(Phone)
Phone.belongsTo(PDigital)

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
sequelize.sync({force: false})

module.exports = {
    Person,
    Phone,
    Profession,
    Location,
    Address,
    PDigital,
    SocialAccount,
}