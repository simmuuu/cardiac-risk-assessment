const { log } = require('console');
const express = require('express');
const app = express();
const path = require('path');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))
// app.use('/public', express.static('public', { 'extensions': ['html', 'js'] }));

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/faq', (req, res) => {
    res.render('Faq')
})
app.get('/aboutus', (req, res) => {
    res.render('aboutUs')
})
app.get('/login', (req, res) => {
    res.render('Login')
})
app.get('/freeopinion', (req, res) => {
    res.render('freeOpinion')
})
app.get('/nearbyhospitals', (req, res) => {
    res.render('nearbyHospitals')
})
app.get('/predict', (req, res) => {
    res.render('form')
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
    console.log('Go to http://localhost:3000/');
})