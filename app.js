const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const userModel = require('./user')

const app = express()
const bodyParser = require("body-parser")
const port = 8080

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({ limit: '1mb' }))

app.use(express.static(path.join(__dirname, '/')))

app.listen(port, () => console.log(`IPMS listening on port ${port}`))

app.get("/sign_out", (req, res) => {
    res.sendFile(path.join(__dirname, "html/login.html"))
})

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

app.post("/initialStock", (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].username === req.body.username) {
                    const returnbody = data[i].port
                    res.json({
                        status: 'success',
                        portfolio: returnbody
                    })
                }
            }
        }
    })
})

app.post("/removeStock", (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const portfolio = data[i].port
                    console.log(portfolio)
                    console.log(req.body)

                    for (let j = 0; j < portfolio.length; j++) {
                        if (portfolio[j][0] === req.body.stock && portfolio[j][1] === req.body.exchange && portfolio[j][2] === req.body.date) {
                            portfolio.splice(j, 1)

                            userModel.updateOne({uname: req.body.username}, {$set: {port: portfolio}}, (err) => {
                                if (err) console.log(err)
                            })
                            console.log("test")
                            return res.json({
                                status: 'success',
                            })
                        }
                    }
                }
            }
        }
    })
})

app.post("/submitStock", (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const currentport = data[i].port
                    currentport.push([req.body.stock, req.body.exchange, req.body.date])
                    userModel.updateOne({username: req.body.username}, {$set: {port: currentport}}, (err) => {
                        if (err) console.log(err)
                    })
                    res.json({
                        status: 'success',
                    })
                }
            }
        }
    })
})

app.post("/set_username", (req, res) => {
    let validateFilter = { username: req.body.newUsername }
    let updateFilter = { username: req.body.username }
    let update = { $set: { username: req.body.newUsername } }

    userModel.findOne(validateFilter, (err, data) => {
        if (data) return res.json({ status: "Username is in use" })
        else userModel.findOneAndUpdate(updateFilter, update, null, () => {
            return res.json({ status: "Username updated" })
        })
    })

})

app.post("/set_password", (req, res) => {
    let filter = { username: req.body.username, password: req.body.password }
    let update = { $set: { password: req.body.newPassword } }

    userModel.findOne(filter, (err, data) => {
        if (!data) return res.json({ status: "Incorrect password" }) // Assuming their username exists
        else userModel.findOneAndUpdate(filter, update, null, () => {
            return res.json({ status: "Password updated" })
        })
    })
})