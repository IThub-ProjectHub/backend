const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    surname: {
        type: String,
        required: true,
        minlength: 3
    },
    passwordHash: String,
    project: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

UserSchema.set("toJSON", {
    transform: (doc, cur) => {
        cur.id = cur._id.toString()
        delete cur._id
        delete cur.__v
        delete cur.passwordHash
    }
})

module.exports = mongoose.model("User", UserSchema)