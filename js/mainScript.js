$(document).ready(function() {
    if (localStorage.getItem("DBSession") === "expired")
        window.location.href = "login.html";
});