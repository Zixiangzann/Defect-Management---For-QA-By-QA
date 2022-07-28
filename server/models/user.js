import mongoose from 'mongoose';
import 'dotenv/config'
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    username: {
      type:String,
      required:true  
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type:String,
        required: true,
        enum:['user','admin'],
        default: 'user' 
    },
    project:{
        type:[]
    },
    firstname:{
        type:String,
        maxLength: 100
    },
    lastname:{
        type:String,
        maxLength: 100
    },
    verified:{
        type: Boolean
    },
    firstlogin:{
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save',async function(next){
    let user = this;

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
    }
    next();

})

userSchema.statics.emailTaken = async function(email){
    const user = await this.findOne({email});
    return !!user;
}

userSchema.statics.usernameTaken = async function(username){
    const user = await this.findOne({"username":username.toLowerCase()})
    return !!user;
}

userSchema.methods.generateAuthToken = function(){
    let user = this;
    const userObj = { sub: user._id.toHexString(),email: user.email};
    const token = jwt.sign(userObj,process.env.DB_SECRET,{ expiresIn:'1d'})
    return token;
}

userSchema.methods.comparePassword = async function(candidatePassword){
    let user = this;
    const match = await bcrypt.compare(candidatePassword,user.password);
    return match;
}

userSchema.methods.generateRegisterToken = function(){
    let user = this;
    const userObj = { sub: user._id.toHexString()};
    const token = jwt.sign(userObj,process.env.DB_SECRET,{ expiresIn:'1d'})
    return token;
}


const User = mongoose.model('User', userSchema)

export default User