const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./user');

const app = express();

const http = require('http');
const fs = require('fs');
const url = require('url');
// const UserModel = require("./user");
const bodyParser = require("body-parser");
const { monitorEventLoopDelay } = require('perf_hooks');
const { assert } = require('console');
const port = 8080;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '/')));

app.listen(port, () => console.log(`IPMS listening on port ${port}`));

app.get("/sign_out", (req, res) => {
    res.sendFile(path.join(__dirname, "html/login.html"));
});


mongoose.connect('mongodb+srv://sedemogroup:dragon123@ipms-database.jh5ed9t.mongodb.net/?retryWrites=true&w=majority', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
}).then(() => console.log(`Database connected`));

app.post("/sign_up", (req, res) => {

    console.log("signing up");

    userModel.findOne({ username: req.body.username }, (err, data) => {
        if (err) {
            console.log("error");
            return res.status(500).send(err);
        }
        if (data) {
            console.log("username in use");
            return res.json({
                username: 'in use',
            });
        }
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            portfolio: []
        });
        newUser.save().then(
            () => console.log("new user save success"),
            () => console.log("new user save failure")
        );
        return res.json({
            username: 'not in use',
        });
    });
});

app.post("/sign_in", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userModel.find((err, data) => {
        if (err)
            return res.status(500).send(err);
        else {
            for (let i = 0; i < data.length; i++)
                if (data[i].username === username && data[i].password === password)
                    return res.json({
                        status: 'success',
                    });
        }
    });
});

app.post("/initialStock", (req, res) => {
    const test = userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].username === req.body.username) {
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
    const test = userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const portfolio = data[i].port;
                    console.log(portfolio);
                    console.log(req.body);

                    for (let j = 0; j < portfolio.length; j++) {
                        if (portfolio[j][0] === req.body.stock && portfolio[j][1] === req.body.exchange && portfolio[j][2] === req.body.date) {
                            portfolio.splice(j, 1);

                            userModel.updateOne({uname: req.body.username}, {$set: {port: portfolio}}, (err, doc) => {
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
    const test = userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].uname === req.body.username) {
                    const currentport = data[i].port;
                    currentport.push([req.body.stock, req.body.exchange, req.body.date]);
                    userModel.updateOne({username: req.body.username}, {$set: {port: currentport}}, (err, doc) => {
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
    const test = userModel.find((err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].username === req.body.oldusername) {
                    if (data[i].pword === req.body.oldpass) {
                        // update the database
                        if (req.body.newpass !== "") {
                            // update password
                            userModel.updateOne({username: req.body.oldusername}, {$set: {password: req.body.newpass}}, (err, doc) => {
                                if (err) console.log(err);
                            });
                        }
                        if (req.body.newusername !== "") {
                            // update username
                            userModel.updateOne({username: req.body.oldusername}, {$set: {username: req.body.newusername}}, (err, doc) => {
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