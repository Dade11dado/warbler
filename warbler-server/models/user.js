const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    profileImageUrl:{
        type:String
    },
    messages: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
})

userSchema.pre("save",async function (next){
    try{
        if(!this.isModified("password")){
            return next()
        }
        let hashedPassword = await bcrypt.hash(this.password,10)
        this.password = hashedPassword
        return next()
    }catch(err){
        return next(err)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword,next){
    try{
        let isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch
    }catch(err){
        return next(err)
    }
}

const User = mongoose.model("User",userSchema)

module.exports = User