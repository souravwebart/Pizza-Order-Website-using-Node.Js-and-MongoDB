require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('express-flash')
const PORT = process.env.PORT || 3000
const connectDB = require("./app/config/db");
const passport = require('passport')
const Emitter = require('events')




// Database connection
connectDB();


// Session Store
// let mongodbStore = MongoStore.create({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

// Session config
var store = new MongoDBStore({
    uri: 'mongodb+srv://user-123:<demo123>@cluster0.es8d3.mongodb.net/pizza?retryWrites=true',
    collection: 'session'
  });

  // Catch errors
store.on('error', function(error) {
    console.log(error);
  });
  
  app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET,
    cookie: {
        cookie: { maxAge: 1000 * 60 * 60 * 24}
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
  }));
  
// app.use(session({
//     secret:process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.DATABASE}),
//     //24 hours
//     cookie: { maxAge: 1000 * 60 * 60 * 24}

// }))
//passport config
const passportInit = require('./app/config/passport')
passportInit (passport)
app.use(passport.initialize());
app.use(passport.session())


app.use(flash())

mongoose.set('useCreateIndex', true);

// Assets
app.use(express.static('public'));

//urlencoded
app.use(express.urlencoded( { extended: false } ));

//JSON Call in express
app.use(express.json());

//Global Middleware

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    res.locals.orders = req.orders
    next()
});

// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)
app.use((res, req)=>{
    res.status(404).render('404-page')

});


const server = app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})

// socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)

})
