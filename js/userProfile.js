$(document).ready(function() {
    $("#username").on("input", function() {
        if ($("#username").val())
            $("#setUserButton").removeClass("disabled");
        else $("#setUserButton").addClass("disabled");
    });
    $("#setUserButton").click(function() {
        let username = $("#username")
        localStorage.setItem("localDBUsername", username.val())
        username.val("");
    });
    $("#password").on("input", function() {
        updatePassValid($("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#setPassButton"));
    });
    $("#passwordConf").on("input", function() {
        updatePassValid($("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#setPassButton"));
    });
    $("#setPassButton").click(function() {
        let setPassButton = $("#setPassButton");
        if (setPassButton.hasClass("disabled")) return;
        let password = $("#password");
        if (verifyInput(password)) {
            setPassword(password);
            localStorage.setItem("localDBSession", "expired");
            window.location.href = "login.html";
        } else {
            $("#invalidPass").html("Password is incorrect");
            $("#passwordOld").val("");
            setPassButton.addClass("disabled");
        }
    });
    $("#logoutButton").click(function() {
        localStorage.setItem("localDBSession", "expired");
        window.location.href = "login.html";
    });
});

function updatePassValid(password, passwordConf, confirm, letter, capital, number, length, setPassButton) {
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

    if (confirm.hasClass("valid") &&
        letter.hasClass("valid") &&
        capital.hasClass("valid") &&
        number.hasClass("valid") &&
        length.hasClass("valid"))
        setPassButton.removeClass("disabled");
    else setPassButton.addClass("disabled");
}

function setPassword(password) {
    localStorage.setItem("localDBPassword", password);
}

// verifies the input of passwordOld field
function verifyInput(password) {
    return localStorage.getItem("localDBPassword") === password.val();
}