const express = require('express')
const mongoose = require('mongoose')
const RoomSchema = require('../models/rooms.model')
const BookedRoom = require('../models/booked.model')
const User = require('../models/users.model')
const router = express.Router();
const multer = require('multer')

router.post('/bookingShow', async (req, res) => {

    const booked = await BookedRoom.find({ "userID": req.body.userID }).populate('room').exec();
    // console.log(booked)
    res.send(booked)
})


router.get('/generalCount', (req, res) => {

    var generalCount = []
    var allRooms = RoomSchema.find({});
    var allUser = User.find()
    var availableRooms = RoomSchema.find({ booked: null })
    var bookedRooms = RoomSchema.find({ booked: { $ne: null } });
    var allAdmin = User.find({ isAdmin: true })

    var allCustomer = User.find({ isAdmin: { $ne: true } })

    allRooms.count(function (err, count) {
        if (err) console.log(err)
        generalCount = [{ id: 'allrooms', value: count }];
    })

    allUser.count(function (err, count) {
        if (err) console.log(err)
        generalCount.push({ 'id': 'allUser', 'value': count })

    });
    availableRooms.count(function (err, count) {
        if (err) console.log(err)
        generalCount.push({ 'id': 'availableRooms', 'value': count })
    });
    bookedRooms.count(function (err, count) {
        if (err) console.log(err)
        generalCount.push({ 'id': 'bookedRooms', 'value': count })
    });
    allAdmin.count(function (err, count) {
        if (err) console.log(err)
        generalCount.push({ 'id': 'allAdmin', 'value': count })
    });
    allCustomer.count(function (err, count) {
        if (err) console.log(err)
        generalCount.push({ 'id': 'allCustomer', 'value': count })
        res.send(generalCount)
    });
})
router.post('/booking', (req, res) => {
    if (!req.body.userID && req.body.roomID && req.body.fromBookedDate) return console.log('not Found')
    const userID = req.body.userID;
    const roomID = req.body.roomID;
    const bookedDate = req.body.fromBookedDate
    // book the room 
    // console.log(req.body)
    var booking = new BookedRoom({
        username: mongoose.Types.ObjectId(userID),
        room: mongoose.Types.ObjectId(roomID),
        from: bookedDate
    })
    booking.save().then((doc) => {
        console.log('booked', doc)
        RoomSchema.findOneAndUpdate({ "_id": roomID }, { $set: { booked: doc._id } }, function (err, docs) {
            if (err) {
                res.send("Error")
            } else {
                if (doc) {

                    res.json(doc)

                }
                else {
                    res.send('Try Again')
                }
            }
        })
    }).catch(err => console.log(err))


})

router.post('/checkOut', async (req, res) => {
    // console.log(req.body)
    const userID = mongoose.Types.ObjectId(req.body.userID);
    const checkOutDate = req.body.checkOutDate;
    const roomID = mongoose.Types.ObjectId(req.body.roomID);

    const price = await RoomSchema.findOne({ "_id": roomID }, 'roomPrice');
    const from = await BookedRoom.findOne({ "username": userID, "room": roomID }, 'from');

    try {
        const data1 = new Date(from.from).getTime()
        const data2 = new Date(checkOutDate).getTime()
        const days = (data2 - data1) / (1000 * 3600 * 24)
        const total = days * price.roomPrice;
        // console.log("total", total, "days", days, "price", price)

        BookedRoom.findOneAndUpdate({ "username": userID, "room": roomID, "to": null }, { $set: { payment: total, to: checkOutDate } }, function (err, doc) {
            if (err) {
                // console.log(err)
                res.send("Error")
            } else {
                if (doc) {
                    // console.log('payment dones', doc)
                    RoomSchema.findOneAndUpdate({ "_id": roomID }, { $set: { booked: null } }, function (err, doc) {
                        if (err) {
                            res.send("Error")
                        } else {
                            if (doc) {

                                res.send("Room Unbooked")

                            }
                            else {
                                res.send('Try Again')
                            }
                        }
                    })

                }
                else {
                    res.send('Try Again')
                }
            }
        })

    }
    catch (err) {
        console.log(err)
    }




})




router.post('/addRooms', (req, res) => {
    console.log(req.file)
    const Storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname)

        }
    })
    const upload = multer({
        storage: Storage
    }).single('roomImage')

    upload(req, res, (err) => {
        if (err) {
            console.log(req.file)
            console.log(err)
        } else {
            RoomSchema.findOne({ 'roomNo': req.body.roomNo }, function (err, room) {
                if (room) {
                    res.send("Room Already Exist")
                } else {
                    var rooms = new RoomSchema({
                        roomNo: req.body.roomNo,
                        roomType: req.body.roomType,
                        roomPrice: req.body.roomPrice,
                        roomDescription: req.body.roomDescription,
                        roomImage: {
                            data: req.file.filename,
                            contentType: 'image/png'
                        },
                        imagePath: req.file.originalname,

                    })
                    rooms.save().then(() => res.send("Register Complete")).catch(err => console.log(err))
                }
            });




        }
    })

})
router.get('/allRooms', (req, res) => {

    const allRooms = RoomSchema.find({ booked: null }, function (err, docs) {


        res.json(docs)

    });;

})
router.get('/availBookedRooms', (req, res) => {

    const allRooms = RoomSchema.find({}, function (err, docs) {

        res.json(docs)
    });;

})

router.get('/BookedRooms', (req, res) => {

    const bookedRooms = RoomSchema.find({ booked: { $ne: null } }, function (err, docs) {

        res.json(docs)

    });;

})


router.post('/updateprice', (req, res) => {
    console.log(req.body)
    RoomSchema.findOneAndUpdate({ "roomNo": req.body.roomNo }, { $set: { roomPrice: req.body.roomPrice } }, function (err, doc) {
        if (err) {
            res.send("Error")
        } else {
            if (doc) {

                res.send('Price Update Successfully')
            }
            else {
                res.send('Try Again')
            }
        }
    })
})

router.post('/updatedescription', (req, res) => {

    RoomSchema.findOneAndUpdate({ "roomNo": req.body.roomNo }, { $set: { roomDescription: req.body.roomDescription } }, function (err, doc) {
        if (err) {
            res.send("Error")
        } else {
            if (doc) {

                res.send('Description Update Successfully')
            }
            else {
                res.send('Try Again')
            }
        }
    })
})


router.post('/deleteRoom', (req, res) => {

    RoomSchema.findOneAndDelete({ 'roomNo': req.body.roomNo }, function (err, doc) {
        if (err) {
            res.send('error')
        }
        if (doc) {

            res.send('Room Has Been Deleted Successfully')
        } else {
            res.send('room doesnt exist')
        }
    })
})

router.get('/availableRooms', async (req, res) => {
    const availRooms = RoomSchema.find({ booked: null }, function (err, docs) {

        res.json(docs)
        console.log(docs)
    });;
})
module.exports = router





