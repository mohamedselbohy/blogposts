const mongoose = require('mongoose');

const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type : String,
        trim : true,
        required : [true,"username is required"]
    },
    email: {
        type : String,
        required: [true,"email is required"],
        unique: true,
        lowercase:true,
        validate: [isEmail,'enter a valid email']
    },
    password: {
        type: String,
        required : [true,"password is required"],
        minlength : [6,"password too short"]
    },
    role: {
        type : String,
        enum : {values : ['user','admin'],message : 'either a user or an admin stop sho5a5 please'},
        default : 'user',
    },
    posts :
        [{
            type: Schema.Types.ObjectId
        }]
},{timestamps:true});

userSchema.post('save', (doc,next)=>{
console.log('new user was created & saved',doc);

    next();
});

userSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth)
        {
            return user;
        }
        else
        {
            throw Error('incorrect password');
        }
    }
    else{
        throw Error('incorrect email');
    }
}


const User = mongoose.model('User',userSchema);

module.exports = User;