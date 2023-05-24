const projectsRoute = require("express").Router()
const Project = require("../models/project")

projectsRoute.get("/", async (req, res) => {
    const projects = await Project.find({ }).populate("User")
    res.json(projects)
})

module.exports = projectsRoute