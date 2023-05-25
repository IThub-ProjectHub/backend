const projectsRoute = require("express").Router()
const Project = require("../models/project")

const { userExtractor } = require("../utils/middleware")

projectsRoute.get("/", async (req, res) => {
    const projects = await Project.find({ }).populate("users", {
        project: 0,
        email: 0
    })
    res.json(projects)
})

projectsRoute.post("/", userExtractor, async (req, res) => {
    const user = req.user

    if (user.project)
        return res.status(405).json({
            error: "project is already created"
        })
    
    const {
        name,
        smdescription,
        industry,
        client,
        description
    } = req.body


    const project = new Project({
        name,
        smdescription,
        industry,
        client,
        description,
        users: [
            user.id
        ]
    })
    const savedProject = await project.save()
    user.project = savedProject._id
    await user.save()
    res.status(201).json(savedProject)
})

projectsRoute.put("/:id", async (req, res) => {
    const { id } = req.body
    const project = await Project.findById(req.params.id)
    const inProject = project.users.filter(user => 
        user.toString() == id
    ) != 0
})

module.exports = projectsRoute