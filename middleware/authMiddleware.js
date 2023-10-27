const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'ilovekids', async (err,decodedToken)=>{
            if(err)
            {
                console.log(err);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}


const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'ilovekids', async (err,decodedToken)=>{
            if(err)
            {
                console.log(err);
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                console.log("username: ",res.locals.user.username);
                next();
            }
        } ) 
    }
    else{
        next();
    }
}

module.exports = {
    requireAuth,
    checkUser
}