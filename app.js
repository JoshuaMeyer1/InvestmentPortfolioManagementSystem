const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const userModel = require('./user')

const app = express()
const bodyParser = require("body-parser")
const port = 8080

const request = require('request')


app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({ limit: '1mb' }))

app.use(express.static(path.join(__dirname, '/')))

app.listen(port, () => console.log(`IPMS listening on port ${port}`))

mongoose.connect('mongodb+srv://sedemogroup:dragon123@ipms-database.jh5ed9t.mongodb.net/?retryWrites=true&w=majority', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
}).then(() => console.log(`Database connected`))

app.post("/sign_up", (req, res) => {
    userModel.findOne({ username: req.body.username }, (err, data) => {
        if (data) return res.json({ status: 'Username is in use' })
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            portfolio: []
        })
        newUser.save().then(() => {
            return res.json({ status: 'New user saved' })
        })
    })
})

app.post("/sign_in", (req, res) => {
    userModel.findOne({ username: req.body.username }, (err, data) => {
        if (data && data.password === req.body.password)
            return res.json({ status: 'Login accepted' })
        return res.json({ status: 'Login rejected' })
    })
})

app.post("/set_username", (req, res) => {
    let validateFilter = { username: req.body.newUsername }
    let updateFilter = { username: req.body.username }
    let update = { $set: { username: req.body.newUsername } }

    userModel.findOne(validateFilter, (err, data) => {
        if (data) return res.json({ status: "Username is in use" })
        else userModel.findOneAndUpdate(updateFilter, update, null, () => res.json({ status: "Username updated" }))
    })
})

app.post("/set_password", (req, res) => {
    let filter = { username: req.body.username, password: req.body.password }
    let update = { $set: { password: req.body.newPassword } }

    userModel.findOne(filter, (err, data) => {
        if (!data) return res.json({ status: "Incorrect password" }) // Assuming their username exists
        else userModel.findOneAndUpdate(filter, update, null, () => res.json({ status: "Password updated" }))
    })
})

app.post("/initialize_stocks", (req, res) => {
    let filter = { username: req.body.username }
    userModel.findOne(filter, (err, data) => res.json(data.portfolio))
})

app.post("/submit_stock", (req, res) => {
    let filter = { username: req.body.username }
    let update = { $push: { portfolio: req.body.stock } }

    console.log(req.body.stock)
    userModel.updateOne(filter, update, null, () => {})

    return res.json({ status: 'Stock submitted' })
})

app.post("/remove_stock", (req, res) => {
    console.log(req.body.username)

    let filter = { username: req.body.username }
    let update = { $pull: { portfolio: req.body.stock } }

    userModel.updateOne(filter, update, null, () => {})

    return res.json({ status: 'Stock removed' })
})

app.post("/stock_price", (req, res) => {
    request.get({
        url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + req.body.name + '&interval=5min&outputsize=full&apikey=5K16DMHFHM4UDTCH',
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, result, data) => {
        if (data === undefined)
            return res.json({
                status: 'failed',
                date: data
            })
        else
            return res.json({
                status: 'success',
                data: data
            })
    })
})