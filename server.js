const express = require('express');
const server = express();
const methodOverride = require('method-override');
const hbs = require('hbs');

// Here we are registering to use partials( means reusing of templates )
hbs.registerPartials(__dirname + '/views/partials');


// The following two lines will help us access whatever submitted through forms
// (by the help of name attribute used in forms)
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.set('view engine','hbs')
server.set('views',__dirname + '/views')

/*
 * The following middleware lets us override with post having ?_method=PUT/DELETE
 * While submitting the form the method will be post but action will include PUT/DELETE
 * parameters which would override post request to work as PUT/DELETE
 */
server.use(methodOverride('_method'));

server.use('/',require('./routes/file'))
//server.use('/about',require('./routes/file')) no need of this line coz we already made a route 
// in file.js on /about

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
 */