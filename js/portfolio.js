let tablesDict = [];

$(document).ready(function() {
    // Input fields
    let stockName = $("#stockName");
    let stockExchange = $("#stockExchange");
    let buyDate = $("#buyDate");

    // Populate the table
    let currUsername = getParameter("username");
    let data = {
        username: currUsername
    }
    let stocks = fetch("/initialStock", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log(data.status);
        console.log(data.portfolio);
        for (let i = 0; i < data.portfolio.length; i++) {
            tablesDict.push({
                'stockName': data.portfolio[i][0],
                'stockExchange': data.portfolio[i][1],
                'buyDate': data.portfolio[i][2]
            });
            console.log(tablesDict);
        }
        updateTable();
    });

    // Add functionality to the inputs and buttons
    stockName.on("input", function() {
        updateSubmitValid(stockName.val(), stockExchange.val(), buyDate.val(), $("#submitStockButton"))
    });
    stockExchange.on("input", function() {
        updateSubmitValid(stockName.val(), stockExchange.val(), buyDate.val(), $("#submitStockButton"))
    });
    buyDate.on("input", function() {
        updateSubmitValid(stockName.val(), stockExchange.val(), buyDate.val(), $("#submitStockButton"))
    });


});

// Update the entry submission button
function updateSubmitValid(stockName, stockExchange, buyDate, submitStockButton) {
    if (stockName && stockExchange && buyDate)
        submitStockButton.removeClass("disabled");
    else submitStockButton.addClass("disabled");
}

// Update the table in the database
function updateTable(listTable) {
    listTable.html("");
    for (let i = 0; i < tablesDict.length; i++) {
        listTable.append('<tr><th scope="row">' + String(i) + '</th><td>' + String(tablesDict[i]["stockName"]) + '</td><td>' + String(tablesDict[i]["stockExchange"]) + '</td><td>' + String(tablesDict[i]["buyDate"]) + '</td><td><button onclick="removeStock(' + i + ')" style="border-radius: 0" class="btn btn-outline-secondary" type="button">Remove</button></td></tr>');
    }
}

// Remove an entry from the table
function removeStock(index) {
    console.log(tablesDict[index]);
    let currUsername = getParameter("username");

    let data = {
        username: currUsername,
        stock: tablesDict[index].stockName,
        exchange: tablesDict[index].stockExchange,
        date: tablesDict[index].buyDate
    }
    console.log(data)

    let removeStock = fetch("/removeStock", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).then(data => {

    })
    tablesDict.splice(index, 1);
    updateTable();
}

// Add an entry to the table
function submitStock(stockName, stockExchange, buyDate) {
    let currUsername = getParameter("username");

    let data = {
        username: currUsername,
        stock: stockName,
        exchange: stockExchange,
        date: buyDate
    }
    console.log(data);

    let submitStock = fetch("/submitStock", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).then(data => {

    })

    tablesDict.push({
        'stockName': stockName,
        'stockExchange': stockExchange,
        'buyDate': buyDate
    });
    updateTable();
}