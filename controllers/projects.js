const projectsRoute = require("express").Router()
const Project = require("../models/project")
const User = require("../models/user")

const mongoose = require("mongoose")

const { userExtractor } = require("../utils/middleware")

projectsRoute.get("/", async (req, res) => {
    const projects = await Project.find({ }).populate("users", {
        project: 0,
        email: 0
    })
    res.json(projects)
})

projectsRoute.get("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id).populate("users", {
        project: 0,
        email: 0
    })
    res.json(project)
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
    user.creator = true
    await user.save()
    res.status(201).json(savedProject)
})

projectsRoute.put("/:id", userExtractor, async (req, res) => {
    const user = req.user
    const userId = user.id
    const project = await Project.findById(req.params.id)

    const inProject = project.users.filter(id => 
        id.toString() == userId
    ) != 0
    
    if (inProject)
        return res.status(405).json({
            error: "user is already in project"
        })
    
    project.users = project.users.concat(new mongoose.Types.ObjectId(userId))
    const changedProject = await Project.findByIdAndUpdate(
        req.params.id, 
        project,
        { new: true }
    )
    user.project = changedProject._id
    await user.save()
    res.json(changedProject)
})

projectsRoute.delete("/:id", userExtractor, async (req, res) => {
    const user = req.user
    const project = await Project.findById(req.params.id)
    const inProject = project.users.filter(id => 
        id.toString() == user.id
    ) != 0
    if (!inProject)
        return res.status(405).json({
            error: "user is not in the project"
        })

    console.log(user)
    
    if (!user.creator) {
        project.users = project.users.filter(id => 
            id.toString() != user.id
        )
        await User.updateOne({ _id: user.id }, { $unset: { project: 1 } })
        await project.save()
        return res.status(204)
    }

    project.users.forEach(async userId => 
        await User.updateOne(
            { _id: userId.toString() },
            { $unset: { project: 1 } }
        )
    )

    await Project.findByIdAndRemove(req.params.id)
    user.creator = false
    await user.save()
    
    res.status(204).end()
})

module.exports = projectsRoute