let tablesDict = []

$(document).ready(() => {
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

    $('#submitStockButton').click(() => {
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
