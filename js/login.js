$(document).ready(function() {
    // $("#loginButton").click(function() {
    //     const username = $("#username");
    //     const password = $("#password");
    //     if(verifyInput(username, password)) {
    //         localStorage.setItem("localDBSession", "active");
    //         window.location.href = "userProfile.html";
    //     } else {
    //         $("#invalidLogin").html("Username or password is incorrect");
    //         username.val("");
    //         password.val("");
    //     }
    // });
    $("#registerButton").click(function() {
        window.location.href = "registration.html";
    });
});

// // verifies the input of login fields
// function verifyInput(username, password) {
//     return localStorage.getItem("localDBUsername") === username.val() &&
//         localStorage.getItem("localDBPassword") === password.val();
// }