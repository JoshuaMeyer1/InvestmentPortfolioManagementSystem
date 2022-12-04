$(document).ready(() => {
    $(".navigation").html(
        "    <ul>" +
        "        <li>" +
        "            <a href style=\"padding:0\">" +
        "                <object data=\"../styles/logo.svg\" width=\"200\" height=\"200\"></object>" +
        "            </a>" +
        "        </li>" +
        "        <li>" +
        "            <a href id=\"toUserProfile\">" +
        "                <span class=\"linkText\">User Profile</span>" +
        "            </a>" +
        "        </li>" +
        "        <li>" +
        "            <a href id=\"toPortfolio\">" +
        "                <span class=\"linkText\">Portfolio</span>" +
        "            </a>" +
        "        </li>" +
        "        <li>" +
        "            <a href id=\"toAnalysis\">" +
        "                <span class=\"linkText\">Portfolio Analysis</span>" +
        "            </a>" +
        "        </li>" +
        "    </ul>"
    )

    $('#toUserProfile').attr('href', 'userProfile.html?username=' + localStorage.getItem('IPMSUsername'))
    $('#toPortfolio').attr('href', 'portfolio.html?username=' + localStorage.getItem('IPMSUsername'))
    $('#toAnalysis').attr('href', 'portfolioAnalysis.html?username=' + localStorage.getItem('IPMSUsername'))
})

