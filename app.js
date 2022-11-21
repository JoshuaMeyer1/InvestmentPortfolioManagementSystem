const express = require('express');
const jquery = require('jquery');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const fs = require('fs');
const url = require('url');
// const UserModel = require("./user");
const bodyParser = require("body-parser");
const { monitorEventLoopDelay } = require('perf_hooks');
const { response } = require('express');
const { assert } = require('console');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/login.html"));
});

app.listen(8080);

mongoose.connect('mongodb+srv://sedemogroup:dragon123@ipms-database.jh5ed9t.mongodb.net/?retryWrites=true&w=majority', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
}).then(() => console.log(`Connected at localhost:8080`));

let db = mongoose.connection;

const userSchema = new mongoose.Schema({
    uname: String,
    pword: String,
    port: Array
});

const User = mongoose.model("User", userSchema);

app.post("/sign_up", async (req, res) => {

    console.log("signing up");

    const username = req.body.name;
    const password = req.body.password;
    const portfolio = [];

    let usernameAvailable = true;

    User.find((err, data) => {
        console.log("testing");
        if (err) {
            console.log("error");
            return res.status(500).send(err);
        } else {
            console.log("iterating " + data.length);
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === username) {
                    return res.
                }
            }
            console.log("finish testing");
            if (usernameAvailable) {
                console.log("new user")
                let newUser = new User({
                    uname: username,
                    pword: password,
                    port: portfolio
                });
                console.log(newUser.toString());
                newUser.save().then(() => console.log("User Created!"));
                console.log("saved user")
                return res.redirect("html/userProfile.html?username=" + username);
            }
        }
    });
});

app.post("/sign_in", (req, res) => {
    const username = req.body.name;
    const password = req.body.password;

    User.find((err, data) => {
        if (err)
            return res.status(500).send(err);
        else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === username) {
                    if (data[i].pword === password)
                        return res.redirect("html/userProfile.html?username=" + username);
                }
            }
        }
    });
});


app.post("/initialStock", (req, res) => {
    const test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const returnbody = data[i].port;
                    res.json({
                        status: 'success',
                        portfolio: returnbody
                    });
                }
            }
        }
    });
});

app.post("/removeStock", (req, res) => {
    const test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const portfolio = data[i].port;
                    console.log(portfolio);
                    console.log(req.body);

                    for (j = 0; j < portfolio.length; j++) {
                        if (portfolio[j][0] === req.body.stock && portfolio[j][1] === req.body.exchange && portfolio[j][2] === req.body.date) {
                            portfolio.splice(j, 1);

                            User.updateOne({uname: req.body.username}, {$set: {port: portfolio}}, (err, doc) => {
                                if (err) console.log(err);
                            });
                            console.log("test");
                            return res.json({
                                status: 'success',
                            });
                        }
                    }
                }
            }
        }
    });
});

app.post("/submitStock", (req, res) => {
    const test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const currentport = data[i].port;
                    currentport.push([req.body.stock, req.body.exchange, req.body.date]);
                    User.updateOne({uname: req.body.username}, {$set: {port: currentport}}, (err, doc) => {
                        if (err) console.log(err);
                    });
                    res.json({
                        status: 'success',
                    });
                }
            }
        }
    });
});

app.post("/userProfileChange", (req, res) => {
    let changedusername = false;
    const test = User.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.oldusername) {
                    if (data[i].pword === req.body.oldpass) {
                        // update the database
                        if (req.body.newpass !== "") {
                            // update password
                            User.updateOne({uname: req.body.oldusername}, {$set: {pword: req.body.newpass}}, (err, doc) => {
                                if (err) console.log(err);
                            });
                        }
                        if (req.body.newusername !== "") {
                            // update username
                            User.updateOne({uname: req.body.oldusername}, {$set: {uname: req.body.newusername}}, (err, doc) => {
                                if (err) console.log(err);
                            });
                            changedusername = true;
                        }
                    } else {
                        res.json({
                            status: 'failed',
                            changed: false
                        });
                    }
                }
            }
        }
    });
    res.json({
        status: 'success',
        changed: true
    });
});