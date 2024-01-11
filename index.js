const { log } = require('console');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const { spawn } = require('child_process');


const User = require('./models/user');
const Predict = require('./models/predict_info');



dotenv.config();


dbUrl=process.env.dbUrl;
secretSessionKey=process.env.secretSessionKey;

// mongoose.connect('mongodb://127.0.0.1:27017/heart-health');
// const db = mongoose.connection;
// db.on("error",console.error.bind(console,"connection error:"));
// db.once("open", ()=>{
//     console.log("Database Connected");
// })
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Mongo connection established");
    })
    .catch((err) => {
        console.log("Error connecting to mongo ", err);
    });





app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
// app.use('/public', express.static('public', { 'extensions': ['html', 'js'] }));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const sessionConfig = {
    secret: secretSessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60), //1hour
        maxAge: 1000 * 60 * 60 //1hour

    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.user = req.user;// Assuming req.user is set by Passport.js
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});




//middleware------------
const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Login in required')
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



app.post('/predict', isLoggedin, async(req,res)=>{

    const currentDate = new Date();
    // Convert to Indian Standard Time (IST)
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const istDate = currentDate.toLocaleString('en-US', options);
    // console.log(istDate); // Output: 1/9/2024, 6:04:56 PM
    req.body.time=istDate;

    let predict= new Predict(req.body);
    await predict.save();

    const pythonProcess = spawn('python', ["F:/Programming/WEB Dev Practice/cardiac-risk-assessment/python/prediction_script.py",predict['_id']]);

    pythonProcess.stdout.on('data', (buffer) => {
        // const output = buffer.toString().trim();
        // console.log(output)
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    pythonProcess.on('close', async(code) => {
        console.log(`Python script exited with code ${code}`);

        if (req.isAuthenticated()) {
            try {
                const user = await User.findById(req.user._id);
                if (user) {
                    // Push the ID of the saved Predict document to the predicts array
                    user.predicts.push(predict._id);
                    req.user.predicts.push(predict._id)
                    // Save the updated user document
                    await user.save();
                    console.log("User updated:", user);
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }

        predict= await Predict.findById(predict._id)
        console.log("PREDICT PROBABILITY IS",parseFloat(predict.predict_probability))
        res.render('outputPage',{predict_probability: parseFloat(predict.predict_probability)})

    });

});



//authentication routes


app.get('/logout', (req, res) => {



    // console.log('Session ID before logout:', req.sessionID); // Log session ID before logout
    // console.log('Session data before logout:', req.session); // Log session data before logout

    req.logout(() => { });  // Provide an empty callback function

    // console.log('Session ID after logout:', req.sessionID); // Log session ID after logout
    // console.log('Session data after logout:', req.session); // Log session data after logout



    res.redirect('/');
    req.flash('success','Logged out');


})




app.get('/login', (req, res) => {
    res.render('Login');
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        // res.redirect('/');




        // Automatically log in the user after successful registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Pass any error to the error handler
            }
            console.log('User logged in successfully after signup:', registeredUser);
            req.flash('success', 'Account created successfully')
            res.redirect('/');
        });
    } catch (e) {
        //we need to have a flash message here , example user already exists
        req.flash('error', 'Something went wrong');
        res.redirect('/login');
    }

});

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/');
});










app.listen(3000, () => {
    console.log('Listening on port 3000')
    console.log('Go to http://localhost:3000/');
})