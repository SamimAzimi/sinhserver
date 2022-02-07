
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const RoomSchema = mongoose.Schema({


    roomNo: Number,
    roomType: String,
    roomPrice: Number,
    roomDescription: String,
    roomImage: {
        data: Buffer,
        contentType: String,
    },
    imagePath: String,
    booked: { type: Schema.Types.ObjectId, ref: 'bookedrooms' },

})


module.exports = mongoose.model('rooms', RoomSchema)