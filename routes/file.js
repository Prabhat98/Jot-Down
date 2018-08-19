const routes = require('express').Router()
const Note = require('../database/db').Notes

routes.get('/',(req,res) =>
{
    const title = 'Hello there and welcome'
    res.render('index',{title , layout:'main'})
})

routes.get('/about',(req,res) =>
{
    res.render('about',{layout:'main'})
})

routes.get('/notes/add',(req,res) =>
{
    res.render('notes/add',{layout:'main'})
})

routes.get('/notes/edit/:id',(req,res) =>
{
    /*
     * First Edit button will be clicked which will take us to /notes/edit/{{id}} and we find 
     * the url to be /notes/edit/2(for example)[the form data is sent from the front-end on the url 
     * and it sets the get request in action in the back-end] that will trigger the get request and
     * the number representing the id is acquired by us using req.params.id, using which we'll find 
     * that particular note in database which further will be edited 
    */
    Note.findOne(
        {
            where:{id:req.params.id}
        })
        .then((editNote) =>
        {
            res.render('notes/edit',
            {
                layout:'main',
                editNote:editNote
            })
            //console.log(editNote) this will give that particular note to be edited
        })
})

routes.get('/mynotes',(req,res) =>
{
    //let colors = [' bg-info',' bg-danger',' bg-warning']
    //let color = colors[Math.floor(Math.random()*colors.length)]
    /*
     * findAll() searches for all the instances in the database and returns the data in mynotes 
     * of .then((mynotes)), now with that data(mynotes) we will display it on the page(notes/mynotes)
     * using hbs rendering    
    */
    // the order clause in findAll arranges the data in descending order of date(row)
    Note.findAll({order:[['date','DESC']]})
        .then((mynotes) =>
        {
            //console.log(mynotes) //this will log the fetched data from database(in mynotes)
            res.render('notes/mynotes',
            {
                layout:'main',
                mynotes:mynotes,
                //color:color
            })
            //console.log(color)       
        })
})

/*
 * When form data is sent on the "/notes" path via post request then the following middleware
 * handles that request
 */
/*
 * Both client side validation and server side validation has been included
 */
routes.post('/notes',(req,res) =>
{
    let flag = false
    if(!(req.body.title && req.body.details))
    {
        flag = true
        res.render('notes/add',
        {
            layout:'main',
            flag,
            title:req.body.title,
            details:req.body.details
        })
    }
    else
    {
        /*
         * The newly created note in the database is returned and passed to .then as newNote 
         */
        Note.create(
            {
                title:req.body.title,
                details:req.body.details
            }).then((newNote) =>
            {
                res.redirect('/mynotes')
            })
    }
})

routes.put('/notes/:id',(req,res) =>
{
    Note.findOne(
        {
            where:{id:req.params.id}
        })
        // Now we will set new values to the existing note values 
        .then((newNote) =>
        {
            newNote.title = req.body.title
            newNote.details = req.body.details
            /*
             * .save() saves it to database and returns a promise which we can do .then() on
             * .then will give us the updated note
             */
            newNote.save()
                .then((updatedNote) =>
                {
                    res.redirect('/mynotes')
                })
        })
})

routes.delete('/notes/:id',(req,res) =>
{
    /* This would execute as null coz the the note is deleted an then this runs
    Note.findOne(
        {
            where:{id:req.params.id}
        })
        .then((found) =>
        {
            console.log(found)
        })
    */
    // Delete method deletes the instance from database
    Note.destroy(
        {
            where:{id:req.params.id}
        })
        .then(() =>
        {
            res.redirect('/mynotes')
        })
})

// Working of PUT and DELETE request as used here

// PUT
/*
 * Firstly the edit button is clicked which triggers the get request on that path, the
 * get request then renders an hbs file that contains that specific note to be edited.
 * Then edit.hbs is rendered which contains a form which submits via PUT on a path, on
 * that path we have assigned a PUT request(in file.js line number 126) which has a 
 * middleware whose work is to update the note
 */

// DELETE
/*
 * Since we dont want any individual page(like in case of PUT we rendered edit.hbs) to be
 * rendered so we wont be needing a GET request in this case which further would have taken
 * us to a form equipped with DELETE method. Indeed in this case we'd assign the form with 
 * the delete button itself in mynotes.hbs from where we'll directly send the DELETE request
 * and that DELETE request will be worked on in file.js 
 */

module.exports = routes