const express = require("express")
const cors = require("cors")

const { requestLogger, unknownEndpoint } = require("./utils/middleware")
const connectDB = require("./mongo")

const usersRoute = require("./controllers/users")
const projectsRoute = require("./controllers/projects")

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
app.use("/api/projects", projectsRoute)

// errors/unknown endpoints
app.use(unknownEndpoint)

module.exports = app