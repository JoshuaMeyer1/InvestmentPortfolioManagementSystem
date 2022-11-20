$(document).ready(function() {
    $("#username").on("input", function() {
        updateMessage($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
    $("#password").on("input", function() {
        updateMessage($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
    $("#passwordConf").on("input", function() {
        updateMessage($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
    $("#registerButton").click(function() {
        if ($("#registerButton").hasClass("disabled")) return;
        createAccount($("#username").val(), $("#password").val());
        window.location.href = "login.html";
    })
});

function updateMessage(username, password, passwordConf, confirm, letter, capital, number, length, registerButton) {
    // password and confirm password should be the same
    if (password.val() === passwordConf.val()) {
        confirm.removeClass("invalid");
        confirm.addClass("valid");
    } else {
        confirm.removeClass("valid");
        confirm.addClass("invalid");
    }

    // password must contain a lowercase
    if(password.val().match(/[a-z]/g)) {
        letter.removeClass("invalid");
        letter.addClass("valid");
    } else {
        letter.removeClass("valid");
        letter.addClass("invalid");
    }

    // Validate capital letters
    if(password.val().match(/[A-Z]/g)) {
        capital.removeClass("invalid");
        capital.addClass("valid");
    } else {
        capital.removeClass("valid");
        capital.addClass("invalid");
    }

    // Validate numbers
    if(password.val().match(/[0-9]/g)) {
        number.removeClass("invalid");
        number.addClass("valid");
    } else {
        number.removeClass("valid");
        number.addClass("invalid");
    }

    // Validate length
    if(password.val().length >= 8) {
        length.removeClass("invalid");
        length.addClass("valid");
    } else {
        length.removeClass("valid");
        length.addClass("invalid");
    }

    if (username.val() &&
        confirm.hasClass("valid") &&
        letter.hasClass("valid") &&
        capital.hasClass("valid") &&
        number.hasClass("valid") &&
        length.hasClass("valid"))
        registerButton.removeClass("disabled");
    else registerButton.addClass("disabled");
}

function createAccount(username, password) {
    localStorage.setItem("localDBUsername", username);
    localStorage.setItem("localDBPassword", password);
}