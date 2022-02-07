const express = require('express')
const mongoose = require('mongoose')
const MessageSchema = require('../models/message.model')

const router = express.Router();
const jwt = require('jsonwebtoken')



router.post('/message', (req, res) => {


    var messageSend = new MessageSchema({

        name: req.body.fname,
        email: req.body.email,
        subject: req.body.subject,
        Message: req.body.message,


    })
    console.log(req.body)
    messageSend.save().then(() => res.send("Message Complete")).catch(err => console.log(err))

})

router.get('/message', async (req, res) => {
    const allmessage = await MessageSchema.find();
    return res.json(allmessage);

})
router.post('/delMessage', (req, res) => {
    console.log(req.body)
    MessageSchema.findOneAndDelete({ '_id': req.body.id }, function (err, doc) {
        if (err) {
            res.send('error')
        } else {
            console.log(doc)
            res.send('Room Has Been Deleted Successfully')
        }
    })
})

module.exports = router