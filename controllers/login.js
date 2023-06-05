const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(
            password, user.passwordHash
        )
    console.log(user, passwordCorrect)
    if (!(user && passwordCorrect))
        return res.status(401).json({
            error: "Неверный логин или пароль"
        })

    const userForToken = {
        name: user.name,
        surname: user.surname,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    
    res.status(200).send({
        token,
        name: user.name,
        surname: user.surname,
        id: user._id
    })
})

module.exports = loginRouter