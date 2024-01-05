const { log } = require('console');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser')
const flash = require('connect-flash');

const User = require('./models/user');



// const uri='mongosh "mongodb+srv://heart-health-dev.hjmecfo.mongodb.net/" --apiVersion 1 --username tejasposham024'



mongoose.connect('mongodb://127.0.0.1:27017/heart-health');
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
})





app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
// app.use('/public', express.static('public', { 'extensions': ['html', 'js'] }));

app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));




const sessionConfig={
    secret: 'THISisAsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*120, //1hour
        maxAge: 1000*60*120 //1hour
        
    }
}
app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.user = req.user; // Assuming req.user is set by Passport.js
    next();
});




//middleware------------
const isLoggedin = (req, res , next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}




//middleware---------------




app.get('/', (req, res) => {
    res.render('home');
});
app.get('/faq', (req, res) => {
    res.render('Faq');
});
app.get('/aboutus', (req, res) => {
    res.render('aboutUs');
});


app.get('/freeopinion', (req, res) => {
    res.render('freeOpinion');
});
app.get('/nearbyhospitals', (req, res) => {
    res.render('nearbyHospitals');
});
app.get('/predict', isLoggedin, (req, res) => {
    res.render('form');
});




//authentication routes


app.get('/logout', (req, res) =>{
    req.logout(() => {});  // Provide an empty callback function
    res.redirect('/');
})




app.get('/login', (req, res) => {
    res.render('Login');
});

app.post('/signup', async(req, res) => {
    try{
        const {username, password} = req.body;
        const user = new User({username});
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        // res.redirect('/');




        // Automatically log in the user after successful registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Pass any error to the error handler
            }
            console.log('User logged in successfully after signup:', registeredUser);
            res.redirect('/');
        });
    } catch(e){
            //we need to have a flash message here , example user already exists
        res.redirect('/login');
    }

});

app.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}) , (req, res) =>{
    // req.flash('success', 'welcome back');
    res.redirect('/');
});



















app.listen(3000, () => {
    console.log('Listening on port 3000')
    console.log('Go to http://localhost:3000/');
})