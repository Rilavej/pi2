const sequelize = require('../config/dbconnection');

const Pessoa = require('../model/pessoa')
const Profissional = require('../model/profissional')
const Adm = require('../model/adm')
const Telefone = require('../model/telefone')
const Uf = require('../model/uf')
const Cidade = require('../model/cidade')
const Endereco = require('../model/endereco')
const RedeSocial = require('../model/redeSocial')
const ContaSocial = require('../model/contaSocial')

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
sequelize.sync({force: true }) /** Remover opção {force: true } quando em produção */

Pessoa.hasMany(Telefone, {foreignKey: 'person_id'})
Telefone.belongsTo(Pessoa, {onDelete: 'CASCADE'})

module.exports = {Pessoa, Profissional, Adm, Telefone, Uf, Cidade, Endereco, RedeSocial, ContaSocial}

