const usersRoute = require("express").Router()
const User = require("../models/user")

const bcrypt = require("bcrypt")

usersRoute.get("/", async (req, res) => {
    const users = await User.find({ }).populate("project")
    res.json(users)
})

usersRoute.get("/:id", async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id).populate("project")

    user
        ? res.json(user)
        : res.status(404).json({
            error: "user is not found"
        })
})

usersRoute.post("/", async (req, res) => {
    const { email, name, surname, password } = req.body

    // password validation
    if (!password || password.length < 3)
        return res.status(400).json({
            error: "created user is invalid"
        })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        email,
        name,
        surname,
        passwordHash
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = usersRoute