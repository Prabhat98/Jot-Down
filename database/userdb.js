const sequelize = require('sequelize');

const userdb = new sequelize('jotdowndb','jotuser','jotpass',
{
    host:'localhost',
    dialect:'mysql'
})

const Users = userdb.define('users',
{
    name:
    {
        type:sequelize.STRING,
        allowNull:false
    },
    email:
    {
        type:sequelize.STRING,
        allowNull:false
    },
    password:
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

userdb.sync()
    .then(() =>
    {
        console.log("User Database has been synced")
    })
    .catch((err) =>
    {
        console.error("Error creating User database")
    })

module.exports = {Users}