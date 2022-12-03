$(document).ready(() => {
    // When the login button is clicked, if enabled it sends a post request to the database with the inputted username and password.
    // The request results in a response with data, indicating whether the inputted username and password were the correct.
    // If the username password pair was incorrect it manipulates the DOM. Otherwise, we redirect to the profile page.
    $("#loginButton").click(() => {
        $.ajax({
            url: '/sign_in',
            type: 'POST',
            datatype: 'json',
            data: {
                'username' : $('#username').val(),
                'password' : $('#password').val()
            },
            success: (data) => {
                if (!data) $('#invalidLogin').html('Incorrect username or password')
                else if (data.status === 'Login accepted') {
                    let username = $('#username').val()
                    localStorage.setItem("IPMSUsername", username)
                    window.location.href = 'userProfile.html?username=' + username
                } else
                    $('#invalidLogin').html('Incorrect username or password')
            },
        })
    })
    $("#registerButton").click(() => {
        window.location.href = "registration.html"
    })
})