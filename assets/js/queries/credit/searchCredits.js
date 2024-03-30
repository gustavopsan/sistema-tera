const searchInput = document.getElementById('searchInput');

async function searchDebits() {
    const debitStr = searchInput.value;

    const searchedCredits = await fetch(
        `${BASEPATH}/debits/search`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queryString: debitStr, sellerId: sellerId })
        }
    )

    let response = await searchedCredits.json();

    //console.log(response);

    creditList.innerHTML = "";

    response.forEach(credit => {
        var newCredit;
        var arrayLength = parseInt(credit.payments.length) - 1;
        
        if(arrayLength > -1) {
            var actualDate = new Date();
            actualDate.setHours(actualDate.getHours() - 3);

            var lastPaymentDate = new Date(credit.payments[arrayLength][0].date);

            lastPaymentDate.setHours(lastPaymentDate.getHours() - 3)

            var isPaidToday = lastPaymentDate.toISOString().split('T')[0] === actualDate.toISOString().split('T')[0];

            newCredit = `
            <tr class=${isPaidToday ? "paid" : "" }>
                <td>${parseInt(credit.customerData.customerId.split("_")[1]).toString().padStart(3, 0)}</td>
                <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                <td>R$ ${(credit.totalValue / credit.paymentsAmount)}</td>
                <td>${credit.payments.length}/${credit.paymentsAmount}</td>
                <td>R$ ${credit.valueRemaing}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">R$</button></td>
            </tr>
            `
        } else {
            newCredit = `
            <tr>
                <td>${parseInt(credit.customerData.customerId.split("_")[1]).toString().padStart(3, 0)}</td>
                <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                <td>R$ ${(credit.totalValue / credit.paymentsAmount)}</td>
                <td>${credit.payments.length}/${credit.paymentsAmount}</td>
                <td>R$ ${credit.valueRemaing}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">R$</button></td>
            </tr>
            `
        }

        creditList.innerHTML += newCredit;
    })
}


function handleSearchEvents(e) {
    e.preventDefault();

    var searchString = e.target.value;

    if (searchString === "") {
        listCredits()
    } else {
        searchDebits()
    }
}