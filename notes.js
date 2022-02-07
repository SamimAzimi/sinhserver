
// const requestofRenewPackage = new RequestRenewPackage({
//     username: user.name,
//     packageRequest: mongoose.Types.ObjectId(req.body.subscribedPackage),
//     statusOfRequest: 'Send'
// })

// const savedRequest = await requestofRenewPackage.save();


// await RequestRenewPackage.findOne({ username: user.name })
//     .populate('packageRequest')
//     .exec(async (error, result) => {
//         if (!error) {
//             res.status(200).json(result)
//         }

//     })

// router.get('/balanceCheck', (req, res) => {

//     const findUser = req.headers['authorization'];
//     jwt.verify(findUser, process.env.SECRET_TOKEN_JWT, async (err, user) => {
//         if (err) return res.sendStatus(401)
//         if (user) {
//             const userfetch = await User.findOne({ 'username': user.name }, { password: 0, _id: 0 })
//             res.status(200).json(userfetch)
//         }
//     })
// })

// 
// const ReachedMaximumUser = (req, res, next) => {
//     const allUsers = User.find()
//     allUsers.count((err, count) => {
//         if (err) console.log(err)

//         if (count < 200) {
//             next();
//         } else {
//             res.status(200).send('You Have Reached Maximum User , Contact Developers')
//         }
//     })

// }
// router.get('/statusRenewPackage', (req, res) => {
//     const findUser = req.headers['authorization'];
//     jwt.verify(findUser, process.env.SECRET_TOKEN_JWT, async (err, user) => {
//         if (err) {
//             res.status(401).json(err)
//         }
//         if (user) {
//             await RequestRenewPackage.find({ username: user.id })
//                 .populate('packageRequest')
//                 .exec(async (error, result) => {
//                     if (!error) {
//                         res.status(200).json(result)
//                     }
//                     if (result) {
//                         res.status(200).json([result])
//                     }

//                 })
//         }
//     })
// })
