const validateDBInformation = require('./mainScript')
const updatePassword = require('./mainScript')
const updateUsername = require('./mainScript')

test('testing with correct password', () => {
    expect(validateDBInformation.validateDBInformation("s", "newpassword", "s")).toBe(true)

})
test('testing with incorrect password', () => { 
    expect(validateDBInformation.validateDBInformation("", "", "")).toBe(false)

})
test('testing update password', () => {
    expect(updatePassword.updatePassword("password")).toBe(true)

})
test('testing update username', () => {
    expect(updateUsername.updateUsername("username")).toBe(true)

})