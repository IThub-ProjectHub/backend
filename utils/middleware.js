const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requestLogger = (req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:", req.path)
    console.log("Body:", req.body, "\n")
    
    next()
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get("Authorization")

    req.token = auth && auth.startsWith("Bearer ")
        ? auth.replace("Bearer ", "")
        : null
    next()
}

const userExtractor = async (req, res, next) => {
    // if (!req.token)
    //     return res.status(401).json({
    //         error: "jwt must be provided"
    //     })

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) 
        return res.status(401).json({
            error: "token invalid"
        })

    req.user = await User.findById(decodedToken.id)
    next()
}

const unknownEndpoint = (req, res) =>
    res.status(404).json({ error: "unknown endpoint" })

const errorHandler = (error, req, res, next) => {
    const name = error.name
    const types = name === "ValidationError" 
        || name === "JsonWebTokenError"

    if (types)
        return res.status(400).json({
            error: error.message
        })
    else if (name === "CastError")
        return res.status(400).json({
            error: "malformatted id"
        })
    
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}