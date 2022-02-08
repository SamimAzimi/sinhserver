const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/users.model')
const router = express.Router();
const jwt = require('jsonwebtoken')


router.get('/verify', (req, res) => {
    const findUser = req.headers['authorization'];
    jwt.verify(findUser, process.env.SECRET_TOKEN_JWT, async (err, user) => {
        if (err) {
            res.status(401).json(err)
        }
        else {
            res.send(user)
        }

    })
})
router.get('/customers', async (req, res) => {
    const allCustomer = await User.find()

    return res.json(allCustomer)
})
router.post('/register', async (req, res) => {
    const userExist = await User.findOne({ 'phoneNumber': req.body.phoneNumber }, 'phoneNumber')
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var users = new User({
        username: req.body.username,
        password: hash,
        creditCard: req.body.creditCard,
        phoneNumber: req.body.phoneNumber,
        isAdmin: req.body.isAdmin
    })
    if (!userExist) {
        const savedUser = await users.save();
        res.send('User Registered')
    } else {
        res.send('User Already Exist')
    }
})
router.post('/delOneCustomer', async (req, res) => {
    User.findByIdAndDelete({ '_id': req.body.id }, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else (
            res.send("your has been deleted successfully")
        )
    })

})

router.post('/login', async (req, res) => {

    const userfetch = await User.findOne({ 'phoneNumber': req.body.phoneNumber })

    if (!userfetch) {
        res.send("Uknown UserName & Password")
        res.end()
    }
    const isMatch = await bcrypt.compare(req.body.password, userfetch.password)
    if (isMatch) {
        const user = {
            id: userfetch._id,
            username: userfetch.username,
            creditCard: userfetch.creditCard,
            phoneNumber: userfetch.phoneNumber,
        }
        const accessToken = jwt.sign(user, process.env.SECRET_TOKEN_JWT, { expiresIn: "20M" });
        if (userfetch.isAdmin) {

            res.json({ accessToken: accessToken, to: "/adminportal", admin: true, id: userfetch._id })
        } else {

            res.json({ accessToken: accessToken, to: "/customerPortal", admin: false, id: userfetch._id })
        }
    } else {
        res.send("Invalid Credential!")
    }
}
)

router.get('/CustomerRequestDetails', (req, res) => {

    const findUser = req.headers['authorization'];

    jwt.verify(findUser, process.env.SECRET_TOKEN_JWT, (err, user) => {

        if (err) {
            res.send(err)
        }
        if (user) {

            const customerDetails = User.findOne({ 'phoneNumber': user.phoneNumber }, function (err, doc) {

                res.json(doc)
            })

        }

    })

})

module.exports = router
