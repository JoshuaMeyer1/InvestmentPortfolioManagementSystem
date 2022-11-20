const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
var http = require('http');
var fs = require('fs');
var url = require('url');
// const UserModel = require("./user");
var bodyParser = require("body-parser");
const { monitorEventLoopDelay } = require('perf_hooks');
const { response } = require('express');
const { assert } = require('console');

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.json({ limit: '1mb' }))


app.use(express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
})


app.listen(8080);

mongoose.connect('mongodb+srv://sedemogroup:dragon123@users.c3xa6zi.mongodb.net/users', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
}).then(console.log('Connected to mongo db'))

var db = mongoose.connection;

const userSchema = {
    uname: String,
    pword: String,
    port: Array
}

const User = mongoose.model("User", userSchema);


app.post("/sign_up", (req, res) => {

    var username = req.body.name;
    var password = req.body.password;
    var portfolio = [];

    var unamexists = false;

    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == username) {
                    unamexists = true;
                }
            }
        }
    })
    if (unamexists == false) {
        let newUser = new User({
            uname: username,
            pword: password,
            port: portfolio
        });
        newUser.save();
        console.log("User Created!");
        return res.redirect("userProfile.html?username=" + username);
    }
})

app.post("/sign_in", (req, res) => {
    var username = req.body.name;
    var password = req.body.password;

    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == username) {
                    if (data[i].pword == password) {
                        return res.redirect("userProfile.html?username=" + username)
                    }
                }
            }
        }
    })
    // newUser.save();
    // console.log("User Created!");
})


app.post("/initialStock", (req, res) => {
    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == req.body.username) {
                    var returnbody = data[i].port;
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
    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == req.body.username) {
                    var portfolio = data[i].port;
                    console.log(portfolio)
                    console.log(req.body)

                    for (j = 0; j < portfolio.length; j++) {
                        if (portfolio[j][0] == req.body.stock && portfolio[j][1] == req.body.exchange && portfolio[j][2] == req.body.date) {
                            portfolio.splice(j, 1)

                            User.updateOne({ uname: req.body.username }, { $set: { port: portfolio}}, (err, doc) => {
                                if (err) console.log(err);
                            })
                            console.log("test");
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
    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == req.body.username) {
                    var currentport = data[i].port;
                    currentport.push([req.body.stock, req.body.exchange, req.body.date])


                    User.updateOne({ uname: req.body.username }, { $set: { port: currentport}}, (err, doc) => {
                        if (err) console.log(err);
                    })

                    res.json({
                        status: 'success',
                    })
                }
            }
        }
    })
})


app.post("/userProfileChange", (req, res) => {
    var changedusername = false;
    var test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname == req.body.oldusername) {
                    if (data[i].pword == req.body.oldpass) {
                        // update the database
                        
                        
                        if (req.body.newpass != "") {
                            // update password
                            User.updateOne({ uname: req.body.oldusername }, { $set: { pword: req.body.newpass}}, (err, doc) => {
                                if (err) console.log(err);
                            })
                        }
                        if (req.body.newusername != "") {
                            // update username
                            User.updateOne({ uname: req.body.oldusername }, { $set: { uname: req.body.newusername}}, (err, doc) => {
                                if (err) console.log(err);
                            })
                            changedusername = true;
                        }
                    } else {
                        res.json({
                            status: 'failed',
                            changed: false
                        })
                    }
                }
            }
        }
    })
    res.json({
        status: 'success',
        changed: true
    })
})
    


// validate the database information
function validateDBInformation(name, password, oldPassword) {
    if (oldPassword == "s") {
        if (name != "") {
            updateUsername(name);
        }
        
        if (password != "") {
            updatePassword(password);
        }
        return true;
    } else {
        return false;
    }
}

// function to update the database username
function updateUsername(name) {
    console.log(name);
}

// function to update the database password
function updatePassword(password) {
    console.log(password);
}


