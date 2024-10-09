module.exports = {
    auth: (req,res,next)=>{
        if (req.isAuthenticated()){
            return next()
        }
        res.render('person/authError', {message: "Usuário ou senha incorretos"} )
    },
    admin: function(req,res,next) {
        if (req.isAuthenticated() && req.user.isAdmin){
            return next()
        }
        res.render('person/authError', {message: "Voçê não é administrador"} )
    }
}