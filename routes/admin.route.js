const express = require('express')
const mongoose = require('mongoose')
const RoomSchema = require('../models/rooms.model')
const BookedRoom = require('../models/booked.model')
const User = require('../models/users.model')
const router = express.Router();


router.get('/paymentsum', (req, res) => {

    const aggrgreat = BookedRoom.aggregate(
        [
            {
                $group:
                {
                    _id: { day: { $dayOfYear: "$from" }, year: { $year: "$to" } },
                    totalAmount: { $sum: { $sum: ["$payment"] } },
                    count: { $sum: 1 }
                }
            }
        ]
        , function (err, doc) {

            res.json(doc)
        })

})


module.exports = router