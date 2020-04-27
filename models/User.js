const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    joinedDate:{
        type:Date,
        default:Date.now
    },
    favorites:{
        type:[Schema.Types.ObjectId],
        ref:'Recipe'
    }
})

// before any users save to the DB
UserSchema.pre('save', function(next){
    //if PW field is not modified
    // AKA if we are not signing up a user
    //  return next
    if(!this.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err) return next(err);

        bcrypt.hash(this.password, salt,(err,hash)=>{
            if(err) return next(err)
            this.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model('User',UserSchema)