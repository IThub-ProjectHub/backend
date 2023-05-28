const mongoose = require("mongoose")
const { DBurl } = require("./utils/config")

const connectDB = async () => {
    mongoose.set("strictPopulate", false)
    mongoose.set("strictQuery", false)
    try {
        await mongoose.connect(DBurl)
        console.log("Connected to DB")
    } catch (error) {
        console.error("Error connecting to DB:", error.message)
    }
}

module.exports = connectDB