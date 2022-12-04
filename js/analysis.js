let tablesDict = []
let currTimePeriod = '3 months'
let currMetric = 'Returns'

$(document).ready(() => {
    $("#metricSelRet").click(() => metricSelection('Returns'))
    $("#metricSelTotalVal").click(() => metricSelection('Total Value'))
    $("#metricSelSortinoRat").click(() => metricSelection('Sortino Ratio'))
    $("#metricSelSharpeRat").click(() => metricSelection('Sharpe Ratio'))
    $("#calculateMetricButton").click(() => calculateMetric())
    $("#3months").click(() => intervalSelection("3 months"))
    $("#6months").click(() => intervalSelection("6 months"))
    $("#1year").click(() => intervalSelection("1 year"))

    $.ajax({
        url: '/initialize_stocks',
        type: 'POST',
        datatype: 'json',
        data: {
            username: localStorage.getItem('IPMSUsername')
        },
        success: (res) => {
            tablesDict = res
            populateTable()
        }
    })
})

function xDaysAgo(days, date = new Date()) {
    return new Date(date.getTime() - days)
}

function toISO(date = new Date()) {
    return date.getUTCFullYear() + "-" +
        pad(date.getUTCMonth() + 1) + '-'
        + pad(date.getUTCDate());
}

function pad(number) {
    let r = String(number);
    if (r.length === 1)
        r = '0' + r;
    return r;
}

function updateChart(metric, timePeriod) {
    let chartDiv= document.getElementById('chartDiv');
    chartDiv.innerHTML = '';
    chartDiv.innerHTML += '<canvas id="myChart"></canvas>';

    let myChart = $('#myChart').getContext('2d');
    let labels = [];
    let data = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    // handle time periods
    if (timePeriod === "3 Months")
        for (let i = 90; i >= 0; i-=5) {
            labels.push(toISO(xDaysAgo(i, currentDate)));
            data.push(0);
        }
    else if (timePeriod === "6 Months")
        for (let i = 180; i >= 0; i-=10) {
            labels.push(toISO(xDaysAgo(i, currentDate)));
            data.push(0);
        }
    else if (timePeriod === "1 Year")
        for (let i = 360; i >= 0; i-=20) {
            labels.push(toISO(xDaysAgo(i, currentDate)));
            data.push(0);
        }

    // handle metrics

    for (let i = 0; i < tablesDict.length; i++) {
        let companyPrices = getPrice(tablesDict[i]['stockName'], i).then((response) => {
            return response;
        }).then(response => {
            for (let j = 0; j < labels.length; j++) {
                if (response[1]['Time Series (Daily)'][labels[j]] !== undefined) {
                    let currentDate = new Date(tablesDict[response[2]]['buyDate']);
                    if (response[1]['Time Series (Daily)'][tablesDict[response[2]]['buyDate']] === undefined) {
                        currentDate.setDate(currentDate.getDate() - 3)
                    }
                    console.log(response[1])
                    if (metric === "Returns" || metric === "Sortino Ratio" || "Sharpe Ratio") {
                        data[j] += tablesDict[i]['stockExchange'] * ((response[1]['Time Series (Daily)'][labels[j]]['5. adjusted close']) - (response[1]['Time Series (Daily)'][toISO(currentDate)]['5. adjusted close']));
                    }
                    if (metric === "Total Value") {
                        data[j] += tablesDict[i]['stockExchange'] * ((response[1]['Time Series (Daily)'][labels[j]]['5. adjusted close']));
                    }
                } else {
                    let currentDate = new Date(tablesDict[response[2]]['buyDate']);
                    if (response[1]['Time Series (Daily)'][tablesDict[response[2]]['buyDate']] === undefined) {
                        currentDate.setDate(currentDate.getDate() - 2)
                    }

                    let labelDate = new Date(labels[j]);
                    labelDate.setDate(labelDate.getDate() - 3)

                    if (metric === "Returns" || metric === "Sortino Ratio" || "Sharpe Ratio") {
                        data[j] += tablesDict[i]['stockExchange'] * ((response[1]['Time Series (Daily)'][toISO(labelDate)]['5. adjusted close']) - (response[1]['Time Series (Daily)'][toISO(currentDate)]['5. adjusted close']));
                    }
                    if (metric === "Total Value") {
                        data[j] += tablesDict[i]['stockExchange'] * ((response[1]['Time Series (Daily)'][toISO(labelDate)]['5. adjusted close']));
                    }
                }
            }
            return (data)
        }).then(response => {
            for (let k = 0; k < data.length; k++) {
                if (data[k] === 0) {
                    if (k === 0) data[k] = data[k + 1]
                    else data[k] = data[k - 1]
                }
            }
            console.log(metricChart)

            if (metric === "Sortino Ratio") {
                let sortinoRatio = 0;
                let minReturn = prompt("Enter your min returns rate: ");
                let sumNeg = 0
                for (let p = 0; p < data.length; p++) {
                    let returnRate = (data[p] - data[0]) / data[0]
                    if (returnRate < minReturn) {
                        sumNeg += (minReturn - returnRate) * (minReturn - returnRate)
                    }
                }
                let downsideVariance = sumNeg / 19
                let downsideDeviation = Math.sqrt(downsideVariance)
                console.log(downsideDeviation)
                console.log(data[18])
                let recentRate = (data[18] - data[0]) / data[0]
                sortinoRatio = (recentRate - minReturn) / (downsideDeviation)
                alert("The sortino ratio of the portfolio is " + sortinoRatio)
            }

            if (metric === "Sharpe Ratio")
                alert("test")


            let metricChart = new Chart(myChart, {
                type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data: {
                    labels: labels,
                    datasets: [{
                        label: metric,
                        data: response
                    }]
                },
                options: {}
            });


            console.log(labels)
            console.log(response)
            metricChart.data.labels = labels;
            metricChart.data.datasets.data = response;
            metricChart.data.datasets.label = metric;
            console.log(metricChart);
            metricChart.update();

        })
    }

}

function populateTable() {
    let stockTable = $('#stockTable')
    stockTable.html('')
    tablesDict.forEach((stock, index) => {
        stockTable.append(
            `<tr>` +
            `<th scope="row"><h5>${ String(index) }</h5></th>` +
            `<td><h5>${ String(stock.stockName) }</h5></td>` +
            `<td><h5>${ String(stock.stockExchange) }</h5></td>` +
            `<td><h5>${ String(stock.buyDate) }</h5></td>` +
            `<td><button id='removeStockButton${index}' class="btn btn-outline-danger" type="button">Remove</button></td>` +
            `</tr>`
        )
        $('#removeStockButton' + index).click(() => {
            $.ajax({
                url: '/remove_stock',
                type: 'POST',
                datatype: 'json',
                data: {
                    username: localStorage.getItem("IPMSUsername"),
                    stock: tablesDict[index]
                },
                success: () => {
                    tablesDict.splice(index, 1)
                    populateTable()
                }
            })
        })
    })
}

function submitStock() {
    let stock = {
        stockName: $("#stockName").val(),
        stockExchange: $("#stockExchange").val(),
        buyDate: $("#buyDate").val()
    }
    if (stock.stockName === "" || stock.stockExchange === "" || stock.buyDate === "") return

    $.ajax({
        url: '/submit_stock',
        type: 'POST',
        datatype: 'json',
        data: {
            username: localStorage.getItem("IPMSUsername"),
            stock: stock
        },
        success: () => {
            tablesDict.push(stock)
            populateTable()
        }
    })
}

function getPrice(stockName, index) {
    $.ajax({
        url: '/stock_price',
        type: 'POST',
        datatype: 'json',
        data: {
            name: stockName
        },
        success: (res) => {
            if (res.status === "success")
                return [0, stockName, res.date, index]
            else return [1, res.data, index]
        }
    })
}

function metricSelection(metric) {
    currMetric = metric
    $('#metricSelectionButton').html(currMetric)
}

function intervalSelection(interval) {
    currTimePeriod = interval
    $('#timeSelection').html(currTimePeriod)
}

function calculateMetric() {
    let metric = $('#metricSelection').html()
    let interval = $('#timeSelection').html()

    if (metric === "Metric" || interval === "Time Period")
        alert("Please select parameters!")
    // else
        // updateChart(metric, interval);
}