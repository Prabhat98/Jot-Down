const routes = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../database/userdb').Users

routes.get('/signup',(req,res) =>
{
    res.render('users/signup',{layout:'main'})
})

// Here we'd be registering users into database in the following post request

routes.post('/signup',(req,res) =>
{
    // Validating the password and confirm password field and that they are of certain length
    let flag1 = false
    let flag2 = false
    let flag3 = false
    if(req.body.password.length < 4)
    {
        flag2 = true
        res.render('users/signup',
        {
            layout:'main',
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
            flag2
        })   
    }
    if(req.body.password!=req.body.password2)
    {
        flag1 = true
        res.render('users/signup',
        {
            layout:'main',
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
            flag1
        })       
    }
    // Currently the password is a plain text, so we need to encrypt the same using bcrypt
    if((flag1 == false)&&(flag2 == false))
    {
        // Checking for if the email is already registered or not
        User.findOne(
            {
                where:{email:req.body.email}
            })
            .then((user) =>
            {
                if(user)
                {
                    flag3 = true
                    res.render('users/signup',
                    {
                        layout:'main',
                        flag3
                    })
                }
                else
                {
                    /* We are creating a new instance of "User" that we imported from userdb.js which will
                    * have the following as rows i.e name, email and password. This new instace will create
                    * a table in the database. Currently the database has the table in it but it doesn't have 
                    * the values in the table, which it will get after we do .save()
                    */
                    const newUser = new User
                    ({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    })
                    // The following will convert our password to hashed form to be stored in the database
                    bcrypt.genSalt(10,(err,salt) =>
                    {
                        bcrypt.hash(newUser.password,salt,(err,hash) =>
                        {
                            if(err)
                            {
                                throw err;
                            }
                            // Overwriting the plain text password with it's hashed form
                            newUser.password = hash
                            newUser.save()
                                .then((user) =>
                                {
                                    res.redirect('/users/login')
                                    //console.log("This is new user's hashed password " + newUser.password + " end")
                                
                                })
                                .catch((err) =>
                                {
                                    console.log(err)
                                    return
                                })
                        })
                    })
                }
            })
    }
})

module.exports = routes

/**
 * Difference between hashing and encryption
 */