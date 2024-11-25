const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')
const { auth, admin } = require('../security/authorization')
const api = require('../controllers/api.js')

router.get('/', personController.getAll) // usar cookie para filtar pela localizaçao do usuario 
router.post('/', personController.search)

router.get('/signup', personController.getRegisterPage)
router.post('/signup', personController.createPerson, personController.login)

router.get('/login', personController.getLoginPage)
router.post('/login', personController.login)
router.get('/loginFail', personController.getLoginPageFail)

router.get('/user', auth, personController.getPersonOrCard, personController.showCard)
router.post('/user', auth, personController.createCard, personController.getPersonOrCard, personController.showCard)

router.get('/user/edit', auth, personController.getPersonOrCard, personController.getEditCardPage)
router.post('/user/edit', auth, personController.deleteCard, personController.createCard, personController.getPersonOrCard, personController.showCard)

router.get('/api/:services', api.getProfessions)

module.exports = router