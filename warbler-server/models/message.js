const mongoose = require("mongoose")

const User = require("./user")

const messageSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
        maxLength: 160
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

messageSchema.pre("remove",async function(next){
    try{
        let user = await User.findById(this.user)
        user.messages.remove(this.id)
        await user.save()
        return next()
    }catch(e){
        return next(e)
    }
})

const Message = mongoose.model("Message",messageSchema)

module.exports = Message