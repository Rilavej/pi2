const sequelize = require('../config/dbconnection')

const Person = require('../models/person')
const Phone = require('../models/phone')
const Profession = require('../models/profession')
const Address = require('../models/address')
const Media = require('../models/media')
const SocialAccount = require('../models/socialAccount')
const Cbo = require('../models/cbo')
const noCboProfession = require('../models/noCboProfession')
const Municipio = require('../models/municipio')
const Uf = require('../models/uf')

Uf.hasMany(Municipio, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})
Municipio.belongsTo(Uf, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})

Municipio.hasMany(Person, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})
Person.belongsTo(Municipio, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})

// The Super Many-to-Many relationship
Person.belongsToMany(Cbo, {through: {model: Profession}, onDelete: 'CASCADE'})
Cbo.belongsToMany(Person, {through: {model: Profession}, onDelete: 'RESTRICT'})
Person.hasMany(Profession, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
Profession.belongsTo(Person, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
Cbo.hasMany(Profession, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})
Profession.belongsTo(Cbo, {onDelete: 'RESTRICT', foreignKey: {allowNull: false}})

Person.hasMany(noCboProfession, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
noCboProfession.belongsTo(Person, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})

Person.hasMany(Phone, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
Phone.belongsTo(Person, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})

Person.hasMany(SocialAccount, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
SocialAccount.belongsTo(Person, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
Media.hasMany(SocialAccount, {foreignKey: {name: 'MediaId', allowNull: true}, onDelete: 'SET NULL'})
SocialAccount.belongsTo(Media, {foreignKey: {name: 'MediaId', allowNull: true}, onDelete: 'SET NULL'})
Person.belongsToMany(Media, {through: {model: SocialAccount, unique: false}, otherKey: 'MediaId'})
Media.belongsToMany(Person, {through: {model: SocialAccount, unique: false}, foreignKey: 'MediaId'})

Person.hasOne(Address, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})
Address.belongsTo(Person, {onDelete: 'CASCADE', foreignKey: {allowNull: false}})

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
const sync = sequelize.sync({force: false})

module.exports = {
    Person,
    Phone,
    Profession,
    Address,
    Media,
    SocialAccount,
    Uf,
    Municipio,
    Cbo,
    noCboProfession,
    sequelize,
    sync
}