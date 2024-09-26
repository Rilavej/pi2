const sequelize = require('../config/dbconnection')

const Pessoa = require('../model/pessoa')
const Profissional = require('../model/profissional')
const Admin = require('../model/admin')
const Telefone = require('../model/telefone')
const Uf = require('../model/uf')
const Cidade = require('../model/cidade')
const Endereco = require('../model/endereco')
const RedeSocial = require('../model/redeSocial')
const ContaSocial = require('../model/contaSocial')

// Pessoa.hasMany(Telefone, {onDelete: 'CASCADE'}) // duplica a chave estrangeira
Telefone.belongsTo(Pessoa, {foreignKey: 'person_id', onDelete: 'CASCADE'})

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
sequelize.sync({force: true}) /** Remover opção {force: true } quando em produção */

module.exports = {Pessoa, Profissional, Admin, Telefone, Uf, Cidade, Endereco, RedeSocial, ContaSocial}