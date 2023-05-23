const usersRoute = require("express").Router()
const User = require("../models/user")

usersRoute.get("/", async (req, res) => {
    const users = await User.find({ })
    res.json(users)
})

module.exports = usersRoute