const express = require('express');
const server = express();
const methodOverride = require('method-override');
const hbs = require('hbs');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')

// Here we are registering to use partials( means reusing of templates )
hbs.registerPartials(__dirname + '/views/partials');


// The following two lines will help us access whatever submitted through forms
// (by the help of name attribute used in forms)
server.use(express.json());
server.use(express.urlencoded({extended:true}));

// express-session helps maintain sessions and passport requires express-session
// to handle the cookies
server.use(session(
  {
    // the secret is used to hash the session and protect it from hijacking
    secret:'somesecretstring'
  }))
server.use(passport.initialize())
server.use(passport.session())

// Serving public folder as static content and joining it with current path to work together
// External CSS, images etc will come under public folder
server.use('/',express.static(path.join(__dirname,'public')))

server.set('view engine','hbs')
server.set('views',__dirname + '/views')

/*
 * The following middleware lets us override with post having ?_method=PUT/DELETE
 * While submitting the form the method will be post but action will include PUT/DELETE
 * parameters which would override post request to work as PUT/DELETE
 */
server.use(methodOverride('_method'));

server.use(flash())

/*
 * When we are logged in then we've access to a request object called user, so we'll 
 * create a global variable for that object so that we can use that anywhere i.e in
 * templates etc to hide or show functionalities 
 */
server.use(function(req,res,next)
{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  // if logged in then res.locals.user will exists else will be set to null
  res.locals.user = req.user || null
  next()
})

server.use('/users', require('./routes/login'))
server.use('/users', require('./routes/signup'))
server.use('/',require('./routes/index'))
//server.use('/about',require('./routes/index')) no need of this line coz we already made a route 
// in index.js on /about

server.listen(2300,()=> 
{
    console.log("Server started at http://localhost:2300")
})

/*
Things to do.
- inserting image in hbs
- designing pages well 
- doubt: while deleting a note is it neccessary to do it with delete request, 
  couldn't it be done like delete button href takes us to an url and we set a get request
  at that path and upon get request we use some delete method of sequelize to delete that
  note from database
- uploading files images etc
- more on how to create global variables and what does res.locals etc mean in line 51
- notes on connect-flash and bcrypt
- disabling flash messages after they are showed
 */