
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bookedRoom = Schema({
    'username': { type: Schema.Types.ObjectId, ref: 'users' },
    'room': { type: Schema.Types.ObjectId, ref: 'rooms' },
    from: Date,
    to: Date,
    payment: Number,
})


module.exports = mongoose.model('bookedRoom', bookedRoom)