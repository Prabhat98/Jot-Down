const sequelize = require('sequelize');

const db = new sequelize('jotdowndb','jotuser','jotpass',
{
    host:'localhost',
    dialect:'mysql'
})

const Notes = db.define('notes',
{
    title:
    {
        type:sequelize.STRING,
        allowNull:false
    },
    details:
    {
        type:sequelize.STRING,
        allowNull:false
    },
    date:
    {
        type:sequelize.DATE,
        allowNull:false,
        defaultValue:sequelize.NOW
    }
})

db.sync()
    .then(() =>
    {
        console.log("Database has been synced")
    })
    .catch((err) =>
    {
        console.error("Error creating database")
    })

module.exports = {Notes}