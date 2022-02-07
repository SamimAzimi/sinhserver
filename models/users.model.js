const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = Schema({

    username: String,
    password: String,
    creditCard: String,
    phoneNumber: String,
    isAdmin: Boolean,
})

module.exports = mongoose.model('users', UserSchema)