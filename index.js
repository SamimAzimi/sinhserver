const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/users.model')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 4000
const app = express()
require('dotenv/config')
var cors = require('cors');
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('uploads'))
// DB Connection
mongoose.connect(process.env.DBCONNECTION,
  {

    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,


  })


mongoose.connection
  .once('open', () => {
    console.log('Database is connected')
  }
  )
  .on('error', error => {
    console.log("Error", error)
  })


const rooms = require('./routes/rooms.routes')
app.use('/rooms', rooms)
const message = require('./routes/message.route')
app.use('/messages', message)
// Sign In and UP Routes 
const users = require('./routes/users');
app.use('/users', users)

const admins = require('./routes/admin.route')
app.use('/admin', admins)



// const ExpireDateCheck = (req, res, next) => {

//   const authHeader = req.headers["authorization"]

//   if (authHeader == null) return res.sendStatus(401)

//   jwt.verify(authHeader, process.env.SECRET_TOKEN_JWT, async (err, user) => {
//     if (err) {
//       return res.sendStatus(401)
//     }
//     if (user) {

//       const userfetch = await User.findOne({ 'username': user.name }, 'expireDate', { _id: 0 })
//       if (userfetch != Date.now()) {
//         req.user = user
//         next();
//       } else {
//         res.status(200).json('Your Package Has been Expired, Kindly Re Subscribe to A Package')

//         console.log('error')
//       }
//     }

//   })

// }




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})