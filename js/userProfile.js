$(document).ready(function() {
    $("#username").on("input", function() {
        if ($("#username").val())
            $("#setUserButton").removeClass("disabled")
        else $("#setUserButton").addClass("disabled")
    })
    $("#setUserButton").click(function() {
        if ($("#setUserButton").hasClass('disabled')) return;

        $.ajax({
            url: '/set_username',
            type: 'POST',
            datatype: 'json',
            data: {
                'username' : localStorage.getItem("IPMSUsername"),
                'newUsername' : $('#username').val()
            },
            success: (data) => {
                let usernameUpdated = $('#usernameUpdated')
                if (data.status === 'Username updated') {
                    let username = $('#username').val()
                    // window.location.href = 'userProfile.html?username=' + username
                    localStorage.setItem("IPMSUsername", username)
                    usernameUpdated.html('Username updated')
                    usernameUpdated.removeClass("invalid")
                    usernameUpdated.addClass("valid")
                } else {
                    usernameUpdated.html('This username is in use')
                    usernameUpdated.removeClass("valid")
                    usernameUpdated.addClass("invalid")
                }
            }
        })
    })
    $("#password").on("input", function() {
        updatePassValid($("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#setPassButton"))
        $('#passwordUpdated').html('')
    })
    $("#passwordConf").on("input", function() {
        updatePassValid($("#password"), $("#passwordConf"), $("#confirm"), $("#letter"), $("#capital"), $("#number"), $("#length"), $("#setPassButton"))
        $('#passwordUpdated').html('')
    })
    $("#setPassButton").click(function() {
        if ($("#setPassButton").hasClass("disabled")) return

        $.ajax({
            url: '/set_password',
            type: 'POST',
            datatype: 'json',
            data: {
                'username': localStorage.getItem("IPMSUsername"),
                'password': $('#passwordOld').val(),
                'newPassword': $('#password').val()
            },
            success: (data) => {
                let passwordUpdated = $('#passwordUpdated')
                if (data.status === 'Password updated') {
                    passwordUpdated.removeClass('invalid')
                    passwordUpdated.addClass('valid')
                    passwordUpdated.html('Password updated')
                } else {
                    passwordUpdated.removeClass('valid')
                    passwordUpdated.addClass('invalid')
                    passwordUpdated.html('Invalid password')
                }
            }
        })
    })
    $("#logoutButton").click(function() {
        localStorage.removeItem("IPMSUsername")
        window.location.href = "login.html"
    })
})

function updatePassValid(password, passwordConf, confirm, letter, capital, number, length, setPassButton) {
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

    if (confirm.hasClass("valid") &&
        letter.hasClass("valid") &&
        capital.hasClass("valid") &&
        number.hasClass("valid") &&
        length.hasClass("valid"))
        setPassButton.removeClass("disabled")
    else setPassButton.addClass("disabled")
}