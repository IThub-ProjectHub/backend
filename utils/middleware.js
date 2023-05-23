const requestLogger = (req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:", req.path)
    console.log("Body:", req.body, "\n")
    
    next()
}

const unknownEndpoint = (req, res) =>
    res.status(404).json({ error: "unknown endpoint" })

module.exports = {
    requestLogger,
    unknownEndpoint
}