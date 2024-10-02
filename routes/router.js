const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

router.get('/',(req,res)=>{
    res.status(200).render('pages/index')
})

router.get('/signup', personController.getRegisterPage)
router.post('/signup', personController.create)

router.get('/login', personController.getLoginPage)
router.post('/login/password',)

module.exports = router