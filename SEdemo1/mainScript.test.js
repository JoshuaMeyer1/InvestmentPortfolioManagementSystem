const validateDBInformation = require('./mainScript')


test('testing with correct password passed', () => {
    expect(validateDBInformation("s", "newpassword", "s")).toBe(true)

})
test('testing with incorrect password passed', () => { //not sure why this doesn't work
    expect(validateDBInformation("NOTs", "newpassword", "NOTs")).toBe(false)

})
