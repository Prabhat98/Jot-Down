const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../database/userdb').Users

// Here we will create our local strategy

passport.use(new LocalStrategy(
    {
        usernameField:'email'
    },(email,password,done) =>
    {
        //console.log("Here the strategy fired and this is the email " + email)
        User.findOne(
            {
                where:{email:email}
            }).then((user) =>
            {
                // We'' check if such user exists in the database by utilizing it's unique email
                if(!user)
                {
                    // The message will be in error variable that we'll use in template to 
                    // display error messages

                    //console.log("  No User Found  ")
                    return done(null, false, {message: "No such user found"})
                }
                // If the user is found then we'll check if the password matches the email or not
                /*
                 * password will be the unencrypted password entered by the user which we'll
                 * compare with the encrypted password present in the database, isMatch is the 
                 * bool value which will either return true or false for if the password matches 
                 */
                bcrypt.compare(password, user.password, (err, isMatch) =>
                {
                    if(err)
                    {
                        throw err
                    }
                    if(isMatch)
                    {
                        return done(null, user)
                    }
                    else
                    {
                        //console.log("  Password Incorrect  ")
                        return done(null, false, {message: "Password Incorrect"})
                    }
                })

            })
    }))

passport.serializeUser(function (user, done)
{
    done(null, user.id)
})
passport.deserializeUser(function (id, done)
{
    User.findOne(
        {
            where:{id:id}
        })
        .then((user) =>
        {
            return done(null, user)
        })
        .catch((err) =>
        {
            done(err)
        })
})

module.exports = passport

/**
 * grab hold of that message variable in order to display messages
 */