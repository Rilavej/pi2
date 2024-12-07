const sequelize = require('../config/dbconnection')

const Person = require('../models/person')
const Phone = require('../models/phone')
const Service = require('../models/service')
const Address = require('../models/address')
const Media = require('../models/media')
const SocialAccount = require('../models/socialAccount')
const Cbo = require('../models/cbo')
const NoCboService = require('../models/noCboService')
const Municipio = require('../models/municipio')
const Uf = require('../models/uf')

Uf.hasMany(Municipio, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })
Municipio.belongsTo(Uf, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })

Municipio.hasMany(Person, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })
Person.belongsTo(Municipio, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })

// The Super Many-to-Many relationship
Person.belongsToMany(Cbo, { through: { model: Service }, onDelete: 'CASCADE' })
Cbo.belongsToMany(Person, { through: { model: Service }, onDelete: 'RESTRICT' })
Person.hasMany(Service, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
Service.belongsTo(Person, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
Cbo.hasMany(Service, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })
Service.belongsTo(Cbo, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })

Person.hasMany(NoCboService, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
NoCboService.belongsTo(Person, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })

Person.hasMany(Phone, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
Phone.belongsTo(Person, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })

Person.hasMany(SocialAccount, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
SocialAccount.belongsTo(Person, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
Media.hasMany(SocialAccount, { foreignKey: { name: 'MediaId', allowNull: true }, onDelete: 'SET NULL' })
SocialAccount.belongsTo(Media, { foreignKey: { name: 'MediaId', allowNull: true }, onDelete: 'SET NULL' })
Person.belongsToMany(Media, { through: { model: SocialAccount, unique: false }, otherKey: 'MediaId' })
Media.belongsToMany(Person, { through: { model: SocialAccount, unique: false }, foreignKey: 'MediaId' })

Person.hasOne(Address, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })
Address.belongsTo(Person, { onDelete: 'CASCADE', foreignKey: { allowNull: false } })

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
const sync = sequelize.sync({ alter: true })

module.exports = {
    Person,
    Phone,
    Service,
    Address,
    Media,
    SocialAccount,
    Uf,
    Municipio,
    Cbo,
    NoCboService,
    sequelize,
    sync
}