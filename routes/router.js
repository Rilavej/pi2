const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

router.get('/', personController.getAll) // usar cookie para filtar pela localizaçao do usuario 
router.post('/', personController.search)

router.get('/signup', personController.getRegisterPage)
router.post('/signup', personController.createPerson,personController.login)

router.get('/login', personController.getLoginPage)
router.post('/login',personController.login)

router.get('/user', personController.getUser) //ferzer middleware auth
router.post('/user', personController.createCard) //ferzer middleware auth 

module.exports = router