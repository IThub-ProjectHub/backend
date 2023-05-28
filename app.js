require("express-async-errors")

const express = require("express")
const cors = require("cors")

const { 
    requestLogger, 
    unknownEndpoint, 
    errorHandler,
    tokenExtractor
} = require("./utils/middleware")
const connectDB = require("./mongo")

const {
    usersRoute,
    projectsRoute,
    loginRoute
} = require("./controllers/")

const app = express()

// DB
connectDB()

// starters
app.use(cors())
app.use(express.json())

// logger
app.use(requestLogger)

// routes
app.use("/api/users", usersRoute)
app.use("/api/projects", tokenExtractor, projectsRoute)
app.use("/api/login", loginRoute)

// errors/unknown endpoints
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app