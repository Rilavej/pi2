const controller = {}

controller.getRegisterPage = async (req, res)=> {
    try {
        res.status(200).render('person/form', {
            //objeto a ser passado para view engine
            
        })
    } catch (error) {

    }

}

module.exports = controller