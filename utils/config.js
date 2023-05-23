require("dotenv").config()

const PORT = process.env.PORT
const DBurl = process.env.DB

module.exports = {
    PORT,
    DBurl
}