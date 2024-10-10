const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')
const {auth, admin} = require('../security/authorization')


router.get('/', personController.getAll) // usar cookie para filtar pela localizaçao do usuario 
router.post('/', personController.search)

router.get('/signup', personController.getRegisterPage)
router.post('/signup', personController.createPerson,personController.login)

router.get('/login', personController.getLoginPage)
router.post('/login',personController.login)

router.get('/user', auth, personController.getUser) //ferzer middleware auth
router.post('/user', auth, personController.createCard) //ferzer middleware auth 

module.exports = router