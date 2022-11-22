$(document).ready(function() {

    // When the username input is edited, update the password validation box.
    $("#username").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })

    // When the password input is edited, update the password validation box.
    $("#password").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })

    // When the password confirmation input is edited, update the password validation box.
    $("#passwordConf").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })

    // When the register button is clicked, if enabled it sends a post request to the database with the inputted username and password.
    // The request results in a response with data, indicating whether the inputted username was already in use.
    // If the username was in use, it manipulates the DOM. Otherwise, we redirect to the profile page.
    $("#registerButton").click(() => {
        if ($("#registerButton").hasClass('disabled')) return;

        $.ajax({
            traditional: true,
            url: '/sign_up',
            type: 'POST',
            datatype: 'json',
            data: {
                'username' : $('#username').val(),
                'password' : $('#password').val()
            },
            success: (data) => {
                if (data.status === 'not in use')
                    window.location.href = "userProfile.html?username=" + $("#username")
                else
                    $('#usernameInUse').html('This username is in use')
            }
        })
    })
})

function updatePassValid(username, password, passwordConf, confirm, letter, capital, number, length, registerButton) {
    // password and confirm password should be the same
    if (password.val() === passwordConf.val()) {
        confirm.removeClass("invalid")
        confirm.addClass("valid")
    } else {
        confirm.removeClass("valid")
        confirm.addClass("invalid")
    }

    // password must contain a lowercase
    if(password.val().match(/[a-z]/g)) {
        letter.removeClass("invalid")
        letter.addClass("valid")
    } else {
        letter.removeClass("valid")
        letter.addClass("invalid")
    }

    // Validate capital letters
    if(password.val().match(/[A-Z]/g)) {
        capital.removeClass("invalid")
        capital.addClass("valid")
    } else {
        capital.removeClass("valid")
        capital.addClass("invalid")
    }

    // Validate numbers
    if(password.val().match(/[0-9]/g)) {
        number.removeClass("invalid")
        number.addClass("valid")
    } else {
        number.removeClass("valid")
        number.addClass("invalid")
    }

    // Validate length
    if(password.val().length >= 8) {
        length.removeClass("invalid")
        length.addClass("valid")
    } else {
        length.removeClass("valid")
        length.addClass("invalid")
    }

    if (username.val() &&
        confirm.hasClass("valid") &&
        letter.hasClass("valid") &&
        capital.hasClass("valid") &&
        number.hasClass("valid") &&
        length.hasClass("valid"))
        registerButton.removeClass("disabled")
    else registerButton.addClass("disabled")
}