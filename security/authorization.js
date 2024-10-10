module.exports = {
    auth: (req,res,next)=>{
        if (req.isAuthenticated()){
            return next()
        }
        res.render('person/login', {message: "Antes é preciso fazer login!"} )
    },
    admin: function(req,res,next) {
        if (req.isAuthenticated() && req.user.isAdmin){
            return next()
        }
        res.render('person/login', {message: "Acesso negado!"} )
    }
}