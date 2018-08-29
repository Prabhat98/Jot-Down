const routes = require('express').Router()
const passport = require('../config/passport')

routes.get('/login',(req,res) =>
{
    res.render('users/login',{layout:'main'})
})

routes.post('/login', passport.authenticate('local',
    {
        successRedirect:'/mynotes',
        faliureRedirect:'/users/login',
        faliureFlash:true
    })
)

routes.get('/logout', (req,res) =>
{
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})


module.exports = routes


