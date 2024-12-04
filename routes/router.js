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

router.get('/api/:services', api.getProfessions)

router.put('/user/update/service', auth, personController.updateServices)
router.put('/user/update/phone', auth, personController.updatePhone)
router.put('/user/update/socialAccount', auth, personController.updateSocialAccount)

router.delete('/user/delete/service/:id', auth, personController.deleteService)
router.delete('/user/delete/service1/:id', auth, personController.deleteNoCboService)
router.delete('/user/delete/phone/:id', auth, personController.deletePhone)
router.delete('/user/delete/socialAccount/:link', auth, personController.deleteSocialAccount)

module.exports = router