const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema(
{
    userID: Number,
    name: String,
    surname: String,
    email: String,
    username: String,
    password: String,
    role: String,
    position: String,
    registrationCode: Number
})

module.exports = usersSchema;
