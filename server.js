require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const PORT = process.env.PORT || 3000
const MongoStore = require('connect-mongo');
const connectDB = require("./app/config/db");




// Database connection
connectDB();


// Session Store
// let mongodbStore = MongoStore.create({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

// Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    //24 hours
    cookie: { maxAge: 1000 * 60 * 60 * 24}

}))

app.use(flash())



// Assets
app.use(express.static('public'));

//JSON Call in express
app.use(express.json());

//Global Middleware

app.use((req, res, next) => {
    res.locals.session = req.session
    next()
});

// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


app.listen(PORT, () => {
    console.log( `Listening on port ${PORT}`)
})