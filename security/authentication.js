// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Person = require('../models/person')
const bcrypt = require('bcrypt')

module.exports = function(passport) {

    passport.use(new LocalStrategy(
        {
            usernameField:'email',
            passwordField:'password'
        },
        async (email , password, done)=> {
            try {
                const user = await Person.findOne({
                    //https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
                    raw: true,
                    where: {
                        email: email
                    }
                })

            if (!user) {
                return done(null, false, {message: 'Usuário ou senha incorreto(s)!'})
            }
            
            const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword)
            if (!isCorrectPassword) {
                return done(null, false, {message: 'Usuário ou senha incorreto(s)!'})
            }

            return done(null, user)

            } catch (err) {
                done(err, false)
            }
        }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done)=>{
        try {
            const user = await Person.findByPk(id, {
                attributes: {exclude: ['hashedPassword','email',]}
            })
            done(null, user)
        } catch (err) {
            done(err, user)
        }
    })
}