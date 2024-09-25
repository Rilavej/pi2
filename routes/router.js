const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')

router.get('/',(req,res) => {
    //res.status(200).render("pages/index")
    res.send('ok')
})

module.exports = router