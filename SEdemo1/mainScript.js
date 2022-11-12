function settingsButtonHandler() {
	
	// set the current db settings variables
    let currentDBName = document.getElementById("dbName").value;
    let newDBPassword = document.getElementById("dbPassword").value;
    let currentDBPassword = document.getElementById("oldPassword").value;
    
    if (validateDBInformation(currentDBName, newDBPassword,currentDBPassword)) {
        document.getElementById("dbName").value = "";
        document.getElementById("dbPassword").value = "";

        localStorage.setItem("localDBName", currentDBName);
    }
    else {
        alert("Incorrect Password. Cannot update!")
        document.getElementById("dbName").value = "";
        document.getElementById("dbPassword").value = "";
    }
}

// validate the database information
function validateDBInformation(name, password, oldPassword) {
    if (oldPassword === "s") {
        if (name !== "")
            updateUsername(name);

        if (password !== "")
            updatePassword(password);
        return true;
     }
     return false;

}

// function to update the database username
function updateUsername(name) {
    console.log(name);
    return true;
}

// function to update the database password
function updatePassword(password) {
    console.log(password);
    return true;
}

// module.exports.validateDBInformation = validateDBInformation;
// module.exports.updateUsername = updateUsername;
// module.exports.updatePassword = updatePassword;