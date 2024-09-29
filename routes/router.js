const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

router.get('/',(req,res)=>{
    res.status(200).render('pages/index')
})

router.get('/person/new', personController.getRegisterPage)

module.exports = router