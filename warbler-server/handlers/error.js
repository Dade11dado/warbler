const errorhandler = (error,req,res,next)=>{
    return res.status(error.status || 500)
            .json({
                message: error.message || "Oops something went wrong"
            })
}

module.exports = errorhandler