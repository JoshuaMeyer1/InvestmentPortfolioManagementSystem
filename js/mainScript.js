$(document).ready(function() {
    if (localStorage.getItem("session") === "expired")
        window.location.href = "login.html";
});