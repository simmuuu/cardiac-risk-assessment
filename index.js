const express = require('express');
const app = express();
const path = require('path');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'/views'))


app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/aboutus',(req,res)=>{
    res.render('aboutUs')
})


app.listen(3000,()=>{
    console.log('Listening on port 3000')
})