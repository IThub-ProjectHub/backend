const usersRoute = require("express").Router()
const User = require("../models/user")

const bcrypt = require("bcrypt")

usersRoute.get("/", async (req, res) => {
    const users = await User.find({ }).populate("Project")
    res.json(users)
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