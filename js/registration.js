$(document).ready(function() {
    $("#username").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
    $("#password").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
    $("#passwordConf").on("input", () => {
        updatePassValid($("#username"), $("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#registerButton"))
    })
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
            success: (data, status, jqXHR) => {
                if (data.username === 'not in use')
                    window.location.href = "userProfile.html?username=" + $("#username");
                else
                    $('#usernameInUse').html('This username is in use')
            },

        });
    });
});

function updatePassValid(username, password, passwordConf, confirm, letter, capital, number, length, registerButton) {
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