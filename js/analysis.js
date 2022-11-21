let currMetric = ""
let currTimePeriod = "";

let tablesDict = [];

function updateTable() {
    let listTable = document.getElementById("stockTable");
    listTable.innerHTML = '';
    for (let i = 0; i < tablesDict.length; i++) {
        listTable.innerHTML += '<tr><th scope="row">' + String(i) + '</th><td>' + String(tablesDict[i]["stockName"]) + '</td><td>' + String(tablesDict[i]["stockExchange"]) + '</td><td>' + String(tablesDict[i]["buyDate"]) + '</td></tr>';
    }
}

function removeStock(index) {
    tablesDict.splice(index, 1);
    updateTable();
}


function submitStock() {
    let stockName = document.getElementById("stockName").value;
    let stockExchange = document.getElementById("stockExchange").value;
    let buyDate = document.getElementById("buyDate").value;

    tablesDict.push({
        'stockName': stockName,
        'stockExchange': stockExchange,
        'buyDate': buyDate
    });


    console.log(tablesDict);
    updateTable();
}

function listTable() {
    tablesDict = JSON.parse(localStorage.getItem("stockTable"));
    updateTable();
}

function metricSelection(metric) {
    currMetric = metric;
    document.getElementById('metricSelection').innerHTML = currMetric;
}

function intervalSelection(interval) {
    currTimePeriod = interval;
    document.getElementById('timeSelection').innerHTML = currTimePeriod;
}

function calculateMetric() {
    if (currMetric === "Dividends") {
        alert("The dividends of your portfolio in the last " + currTimePeriod + " is " + "XYZ")
    }
    else if (currMetric === "Standard Deviation") {
        alert("The dividends of your portfolio in the last " + currTimePeriod + " is " + "XYZ")
    }
    else if (currMetric === "Sortino Ratio") {
        alert("The dividends of your portfolio in the last " + currTimePeriod + " is " + "XYZ")
    }
}