const express = require('express');
const morg = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Blog = require('./models/blog.js')
const blogRoutes = require("./routes/blogRoutes.js");
const authRoutes = require("./routes/authRoutes.js")
const cookieParser = require('cookie-parser');
const middlewares = require('./middleware/authMiddleware.js')


const dbURI = 'mongodb+srv://msayedelbohy:WINway22@nodelearning.z7llbef.mongodb.net/Imnode?retryWrites=true&w=majority';
mongoose.connect(dbURI).then((result)=>{
    console.log("connection to database successful");
    app.listen(3000);
}).catch((err)=>console.log(err));


app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine','ejs');
app.set('views','pages');

app.use(morg('tiny'));

// app.get('*',middlewares.checkUser);
app.use(middlewares.checkUser);


app.get('/',(req,res)=>{
    res.redirect('/blogs')
})


app.get('/about',(req,res)=>{
    res.render('about',{title:'about',user:res.locals.user})
})

app.get('/about-us',(req,res)=>{
    res.redirect('/about');
}) 


//blog-routes
app.use(blogRoutes);
app.use(authRoutes);

app.use((req,res)=>{
    res.status(404).render('404',{title:'404'});
})