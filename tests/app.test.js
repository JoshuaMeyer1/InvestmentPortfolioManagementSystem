const mongoose = require('mongoose')
mongoose.set('strictQuery', false) // get rid of an annoying deprecation notification
const request = require('supertest')
const app = require('../app')
const userModel = require('../user')

require('dotenv').config()

request(app).post("/delete_all").send()
userModel.deleteMany({})

userModel.remove({ username: "Username123" })
request(app).post("/delete_user").send({
    username: "Username123"
})
// throw new Error('stop')

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
})

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close()
})

test("Should sign up a new user", async () => {
    let res = await request(app).post("/delete_all").send()
    expect(JSON.parse(res.text)).toStrictEqual({ "status": "All users deleted" })
    res = await request(app).post("/sign_up").send({
        username: "Username123",
        password: "Password123"
    })
    expect(JSON.parse(res.text)).toStrictEqual({ "status": "New user saved" })
    res = await request(app).post("/delete_all").send()
    expect(JSON.parse(res.text)).toStrictEqual({ "status": "All users deleted" })
})

// test("Should fail to sign up a user with a username already in use", async () => {
//     await request(app).post("/delete_all").send()
//     request(app).post("/sign_up").send({
//         username: "Username123",
//         password: "Password123"
//     })
//     const res = await request(app).post("/sign_up").send({
//         username: "Username123",
//         password: "Password123"
//     })
//     await request(app).post("/delete_all").send()
//
//     expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
//     expect(res.status).toBe(200)
//     expect(JSON.parse(res.text)).toStrictEqual({ "status": "Username is in use" })
// })

// test("Should sign in a user", async () => {
//     await request(app).post("/delete_all").send()
//
//     await request(app).post("/delete_all").send()
// })