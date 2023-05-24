const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    smdescription: {
        type: String,
        required: true,
        minlength: 10
    },
    industry: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

projectSchema.set("toJSON", {
    transform: (doc, cur) => {
        cur.id = cur._id.toString()
        delete cur._id
        delete cur.__v
    }
})

module.exports = mongoose.model("Project", projectSchema)