let tablesDict = []
let currTimePeriod
let currMetric

$(document).ready(() => {
    $("#metricSelRet").click(() => {
        currMetric = 'Returns'
        $('#metricSelection').html(currMetric)
    })
    $("#metricSelTotalVal").click(() => {
        currMetric = 'Total Value'
        $('#metricSelection').html(currMetric)
    })
    $("#metricSelSortinoRat").click(() => {
        currMetric = 'Sortino Ratio'
        $('#metricSelection').html(currMetric)
    })
    $("#metricSelSharpeRat").click(() => {
        currMetric = 'Sharpe Ratio'
        $('#metricSelection').html(currMetric)
    })
    $("#metricSelStdDev").click(() => {
        currMetric = 'Sharpe Ratio'
        $('#metricSelection').html(currMetric)
    })
    $("#metricSelRSq").click(() => {
        currMetric = 'R Squared'
        $('#metricSelection').html(currMetric)
    })
    $("#calculateMetricButton").click(() => {
        if (currTimePeriod && currMetric)
            updateChart()
        else alert("Please select parameters")
    })
    $("#3months").click(() => {
        currTimePeriod = '3 Months'
        $('#timeSelection').html(currTimePeriod)
    })
    $("#6months").click(() => {
        currTimePeriod = '6 Months'
        $('#timeSelection').html(currTimePeriod)
    })
    $("#1year").click(() => {
        currTimePeriod = '1 Year'
        $('#timeSelection').html(currTimePeriod)
    })

    $.ajax({
        url: '/initialize_stocks',
        type: 'POST',
        datatype: 'json',
        data: {
            username: localStorage.getItem('IPMSUsername')
        },
        success: res => {
            tablesDict = res
            populateTable()
        }
    })
})

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

function toISO (date = new Date()) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
}

function pad(number) {
    let r = String(number)
    if (r.length === 1)
        return '0' + r
    return r;
}

function updateChart() {
    let chartExist = Chart.getChart("myChart")
    if (chartExist)
        chartExist.destroy()

    let metricChart = new Chart(document.getElementById('myChart').getContext('2d'), {
        type: 'line',
        data: {},
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                    }
                }],
            },
            responsive: true,
            startsAtZero: true,
            background: 'white'
        }
    })

    // handle time periods
    let i, inc
    if (currTimePeriod === "3 Months") {
        i = 90
        inc = 5
    }
    if (currTimePeriod === "6 Months") {
        i = 180
        inc = 10
    }
    if (currTimePeriod === "1 Year") {
        i = 360
        inc = 20
    }

    // key-value pairs of dates and data, for each individual stock
    let data = {}
    let calcs = {}
    tablesDict.forEach(stock => data[stock.stockName] = {})
    while (i >= 0) {
        let iDaysAgo = new Date()
        iDaysAgo.setDate(iDaysAgo.getDate() - i - 1)

        // If the day is a weekend, we have to search to make it Friday
        if (iDaysAgo.getDay() === 0) iDaysAgo.setDate(iDaysAgo.getDate() - 2) // 0 represents Sunday
        if (iDaysAgo.getDay() === 6) iDaysAgo.setDate(iDaysAgo.getDate() - 1) // 6 represents Saturday

        iDaysAgo = toISO(iDaysAgo)
        tablesDict.forEach(stock => data[stock.stockName][iDaysAgo] = 0)
        i -= inc
    }

    let xVals = [], yVals = {}
    metricChart.data.labels = xVals

    // handle metrics
    tablesDict.forEach(stock => {
        $.ajax({
            url: '/stock_price',
            type: 'POST',
            datatype: 'json',
            data: {
                stockName: stock.stockName
            },
            success: res => {
                for (let lookupDate in data[stock.stockName]) {
                    if (res[lookupDate])
                        data[stock.stockName][lookupDate] = res[lookupDate]
                }

                // Find the adjusted close for the buy date of the stock
                let buyDate = new Date(stock.buyDate) // Assuming the buy date is from within 20 years ago

                // If the day is a weekend, we have to make it Friday
                if (buyDate.getDay() === 0) buyDate.setDate(buyDate.getDate() - 2) // 0 represents Sunday
                if (buyDate.getDay() === 6) buyDate.setDate(buyDate.getDate() - 1) // 6 represents Saturday

                let AdjCloseAtBuyDate = parseFloat(res[toISO(buyDate)]['5. adjusted close'])
                if (currMetric === "Returns" || currMetric === "Sortino Ratio" || currMetric === "Sharpe Ratio") {
                    for (let lookupDate in data[stock.stockName]) {
                        if (!calcs[lookupDate]) calcs[lookupDate] = 0
                        calcs[lookupDate] += parseInt(stock.stockExchange) * (parseFloat(data[stock.stockName][lookupDate]['5. adjusted close']) - AdjCloseAtBuyDate)
                    }
                } else if (currMetric === "Total Value") {
                    for (let lookupDate in data[stock.stockName]) {
                        if (!calcs[lookupDate]) calcs[lookupDate] = 0
                        calcs[lookupDate] += parseInt(stock.stockExchange) * parseFloat(data[stock.stockName][lookupDate]['5. adjusted close'])
                    }
                }

                yVals[stock.stockName] = []
                for (let date in calcs) {
                    if (!xVals[date])
                        xVals.push(date)
                    yVals[stock.stockName].push(calcs[date])
                }

                if (currMetric === "Sortino Ratio") {
                    let minReturn = prompt("Enter your min returns rate: ")
                    let sumNeg = 0
                    for (let yval in yVals[stock.stockName]) {
                        let returnRate = (yval - yVals[stock.stockName][0]) / yVals[stock.stockName][0]
                        if (returnRate < minReturn)
                            sumNeg += (minReturn - returnRate) * (minReturn - returnRate)
                    }
                    let downsideVariance = sumNeg / 19
                    let downsideDeviation = Math.sqrt(downsideVariance)
                    let recentRate = (yVals[stock.stockName][18] - yVals[stock.stockName][0]) / yVals[stock.stockName][0]
                    let sortinoRatio = (recentRate - minReturn) / (downsideDeviation)
                    alert("The sortino ratio of the portfolio is " + sortinoRatio)
                }
                if (currMetric === "Sharpe Ratio") {
                    let sum = 0
                    let sumSquared = 0
                    for (let yval in yVals[stock.stockName]) {
                        let returnRate = (yval - yVals[stock.stockName][0]) / yVals[stock.stockName][0]
                        sum += returnRate
                        sumSquared += returnRate * returnRate
                    }
                    let meanReturn = sum / data.length
                    let standardDeviation = Math.sqrt(sumSquared / 19)

                    let sharpeRatio = meanReturn / standardDeviation;
                    alert("The sharpe ratio of the portfolio is " + sharpeRatio);
                }
                if (currMetric === "Standard Deviation") {
                    let sumSquared = 0
                    for (let yval in yVals[stock.stockName]) {
                        let returnRate = (yval - yVals[stock.stockName][0]) / yVals[stock.stockName][0]
                        sumSquared += returnRate * returnRate
                    }
                    let standardDeviation = Math.sqrt(sumSquared / 19)
                    alert("The standard deviation of the portfolio is " + standardDeviation)
                }
                if (currMetric === "R Squared") {

                }

                // Add the new dataset
                metricChart.data.datasets.push({
                    label: stock.stockName + ' ' + currMetric,
                    data: yVals[stock.stockName],
                    tension: 0.2,
                    borderColor: getRandomColor()
                })

                // This is a patch for some wierd Chartjs mechanic that doubles the x-axis each time we add a new set
                while (metricChart.data.labels.length > 19)
                    metricChart.data.labels.pop()

                metricChart.update()
            }
        })
    })
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)]
    return color;
}
