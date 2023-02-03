import mongoose from "mongoose";
const [Schema] = mongoose;

const blogSchema = new Schema({
    username: {
        type: String,
        required
    },
    password: {
        type: String,
        required
    }
})

module.exports = blogSchema;