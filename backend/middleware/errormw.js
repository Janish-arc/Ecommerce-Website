import handleError from "../helper/handleError.js"

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500  
    err.message = err.message

    if(err.code === 11000){
        const message = `This ${Object.keys(err.keyValue)} is already registered`
        err = new handleError(message, 404)
    }
    res.status(err.statusCode).json({success: false, message: err.message})
}