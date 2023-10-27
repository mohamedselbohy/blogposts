const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err)=>{
    console.log(err);
    let error = {username:'',email :'',password:'',role:''};

    if(err.message === 'incorrect email' )
            error.email="this email is not registered";
    if(err.message==='incorrect password')
        error.password="the password is incorrect for this email";
    if(err.code === 11000){
        error.email = 'that email is already registered!';
    }

    if(err.message.includes('User validation failed:')){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message;
        })
    }
    return error;
}

const maxage = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id},'ilovekids',{
        expiresIn: maxage
    })
}

const user_create_get = (req,res)=>{
    res.render('signup',{title:'sign up to blogjob',user:res.locals.user});
}

const user_create_post = async (req,res)=>{
    const {email,password} = req.body;
    try{
    const user = await User.create(req.body);
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly: true, maxAge: 1000*maxage});
    res.status(201).json({user:user._id});
}
catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const user_login_get = (req,res)=>{
    res.render('login',{title:'log in to blogjob',user:res.locals.user});
}

const user_login_post = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true, maxAge: 1000*maxage});
        res.status(200).json({user:user._id});
    }
    catch(err){
        console.log(err);
        let errors = handleErrors(err);
    res.status(400).json({errors});
    }
}

const user_logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
}

module.exports = {
    user_create_get,
    user_create_post,
    user_login_get,
    user_login_post,
    user_logout_get
}