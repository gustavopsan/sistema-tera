const Params = new URLSearchParams(window.location.search);
const customerId = Params.get("cid");
const clientIdEl = document.getElementById("clientIdEl");
const clientNameEl = document.getElementById('customer-name');
var customerIdString = "";

// Nome autoexplicativo
function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

async function laodCustomerData() {
    const customerData = await fetch(
        `${BASEPATH}/customer/find`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId: customerId })
        }
    );

    let response = await customerData.json();

    clientIdEl.value = response.clientId;
    clientNameEl.innerText = response.name;
    customerIdString = response.customerId;
    loadCustomerCredits();
}

async function loadCustomerCredits() {
    const credits = await fetch(
        `${BASEPATH}/debits/listCustomerDebits`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId: customerIdString, sellerId: sellerId })
        }
    );

    let response = await credits.json();

    response.forEach(credit => {
        let date = credit.firstPaymentDate.toString().split('T')[0];
        let creditModel;

        if (credit.paymentModel == "daily"){
            creditModel = "Diário"
        } else if (credit.paymentModel == "weekly"){
            creditModel = "Semanal"
        }

        var dateValue = formateAMerdaDaData(date);
        var item = `
            <tr>
                <td>${dateValue}</td>
                <td>R$ ${credit.totalValue}</td>
                <td>${creditModel}</td>
                <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.isQuited ? "Quitado" : "Aberto"}</a></td>
            </tr>`;
        
        document.getElementById('debits-list').innerHTML += item;
    })
}

window.addEventListener('load', laodCustomerData)
