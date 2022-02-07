const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({


    name: String,
    email: String,
    subject: String,
    Message: String,

})


module.exports = mongoose.model('MessageSchema', MessageSchema)