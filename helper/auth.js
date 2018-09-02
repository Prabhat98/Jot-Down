module.exports = 
{
    ensureAuthenticated: function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next()
        }
        req.flash('error_msg', 'Not Authorized')
        res.redirect('/users/login')
    }
}

/*
 * ensureAuthenticated function will intercept the request and make sure that the request has been
 * authenticated with passport (i.e that the request has been sent by the logged in user), 
 * isAuthenticated is a bool function which will return either true or false for an authorized/
 * logged in user.  
 */