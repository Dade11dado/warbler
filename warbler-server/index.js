require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const errorHandler = require("./handlers/error")
const authRoutes = require("./routes/auth")
const messagesRoutes = require("./routes/messages")
const {loginRequired, ensureCorrectUser} = require("./middleware/auth")

const PORT = 8081

app.use(cors())
app.use(bodyParser.json())

//all my routes here
app.use("/api/auth",authRoutes)
app.use("/api/users/:id/messages",
    loginRequired,
    ensureCorrectUser,
    messagesRoutes)

app.get("/api/messages", loginRequired, async function(req,res,next){
    try{
        let messages = await db.Message.find().sort({createdAt: "desc"})
            .populate("user",{
                username:true,
                profileImageUrl: true
            })
            return res.status(200).json(messages)
    }catch(e){
        return next(e)
    }
})

app.use((req,res,next)=>{
    let err = new Error("Not found")
    err.status = 404
    next(err)
})

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server starting on port ${PORT}`)
})