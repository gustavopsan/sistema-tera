const Params = new URLSearchParams(window.location.search);
const debitId = Params.get("debit");

const debitIdEl = document.getElementById('debitIdEl');
const nameEl = document.getElementById('customer-name');
const totalValueEl = document.getElementById('total-value');
const paymentsAmountEl = document.getElementById('payments-amount');
const paymentValueEl = document.getElementById('payment-value');
const paymentsList = document.getElementById('payments-list');
const paidValueEl = document.getElementById('paid-value');
const paymentsRemaingEl = document.getElementById('payments-remaing');
const valueRemaingEl = document.getElementById('value-remaing');
const paymentModelEl = document.getElementById('payment-model');
const firstPaymentDateEl = document.getElementById('first-payment-date');
const payDebitButton = document.getElementById('pay-button');


// Nome autoexplicativo
function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

async function showDebitInfo() {
    debitIdEl.innerHTML = debitId;

    var requestData = {
        debitId: debitId
    }

    const payment = await fetch(
        `${BASEPATH}/debits/find`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }
    );

    let response = await payment.json();

    payDebitButton.dataset.debitId = response.debitId;
    payDebitButton.dataset.clientName = response.customerData.name;
    nameEl.innerHTML = response.customerData.name;
    totalValueEl.innerHTML = "R$ " + response.totalValue;
    paymentsAmountEl.innerHTML = response.paymentsAmount;
    paymentValueEl.innerHTML = "R$ " + (response.totalValue / response.paymentsAmount);
    paidValueEl.innerHTML = "R$ " + (response.totalValue - response.valueRemaing);
    paymentsRemaingEl.innerHTML = response.paymentsRemaing;
    valueRemaingEl.innerHTML = "R$ " + response.valueRemaing;
    
    if (response.paymentModel == "daily") { paymentModelEl.innerHTML = "Diária" }
    else if (response.paymentModel == "weekly") { paymentModelEl.innerHTML = "Semanal" };

    let date = response.firstPaymentDate.toString().split('T')[0];
    firstPaymentDateEl.innerHTML = formateAMerdaDaData(date);

    response.payments.forEach(payment => {
        var date = new Date(payment[0].date).toLocaleString('pt-BR');

        var dateValue = date.split(',')[0]
        var item = `
            <tr>
                <td>${dateValue.split(' ')[0]}</td>
                <td>${payment[0].paymentMethod}</td>
                <td>R$ ${payment[0].value}</td>
                <td>
                    <button class="payment-button" data-debit-id="${response.debitId}" data-payment-index="${payment[0].index}">
                        <img src="/assets/img/x.svg">
                    </button>
                </td>
            </tr>`;
        
        document.getElementById('payments-list').innerHTML += item;
    })

    addPaymentEvents();
}

function addPaymentEvents() {
    var paymentButtons = document.querySelectorAll('.payment-button');

    paymentButtons.forEach(button => button.addEventListener('click', revokeDebitPayment));
}

async function revokeDebitPayment(event) {
    var debitId = event.target.parentElement.dataset.debitId;
    var paymentIndex = event.target.parentElement.dataset.paymentIndex;

    const revoked = await fetch(
        `${BASEPATH}/debits/revokeDebitPayment`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ debitId: debitId, paymentIndex: paymentIndex})
        }
    );

    let response = await revoked.json();

    if (response) {
        window.location.reload();
    }
}

if (Params.has('debit')) {
    window.addEventListener('load', showDebitInfo)
}