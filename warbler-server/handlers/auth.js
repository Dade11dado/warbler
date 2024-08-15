const e = require("express")
const db = require("../models")
const jwt = require("jsonwebtoken")

exports.signin = async (req,res,next)=>{
    try{
        let user = await db.User.findOne({
            email: req.body.email
        })
        let {id,username, profileImageUrl} = user
        let isMatch = await user.comparePassword(req.body.password)
        console.log(isMatch)
        if(isMatch){
            let token = jwt.sign({
                id,
                profileImageUrl,
                username
            },process.env.SECRET_KEY)
            return res.status(200)
            .json({
                id,
                username,
                profileImageUrl,
                token
            })
        }else{
            return next({
                status:400,
                message:"Invalid Email/password"
            })
        }
    }catch(err){
        return next(e)
}}

exports.signup = async (req,res,next)=>{
    try{
        let user  = await db.User.create(req.body)
        let {id,username,profileImageUrl} = user
        //create token
        let token = jwt.sign({
            id,username,profileImageUrl
        },process.env.SECRET_KEY)
        return res.status(200)
        .json({
            id,
            username,
            profileImageUrl,
            token
        })
    }catch(err){
        if(err.code === 11000){
            err.message = "Sorry, the usename and or email is taken"
        }
        return next({
            status:400,
            message:err.message
        })
        //see what kind of error
        //if it is a certain error
        //we respond email taken
        //otherwise a 400
    }
}