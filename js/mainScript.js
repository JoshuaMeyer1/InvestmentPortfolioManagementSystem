$(document).ready(function() {
    if (localStorage.getItem("localDBSession") === "expired")
        window.location.href = "login.html";
});