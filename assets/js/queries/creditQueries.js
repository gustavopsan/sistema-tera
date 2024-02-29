const creditList = document.getElementById("creditList");
const searchInput = document.getElementById('searchInput');
const sellerId = getCookie('sellerId');

const nameInput = document.getElementById('nameInput');
const creditValueNumber = document.getElementById('creditValue');
const paymentsAmount = document.getElementById('paymentsAmount');
const firstPaymentDate = document.getElementById('firstPaymentDate');
const nameSpan = document.getElementById('nameAutocomplete');
const idInput = document.getElementById('idInput');

const finalValueSpan = document.getElementById('finalValueSpan');
const paymentsAmountSpan = document.getElementById('paymentsAmountSpan');
const paymentValueSpan = document.getElementById('paymentValueSpan');
const firstPaymentDateSpan = document.getElementById('firstPaymentDateSpan');
const lastPaymentDateSpan = document.getElementById('lastPaymentDateSpan');

// Nome autoexplicativo
function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

// Setando dados de amostragem no momento de criação do débito
function calculateValue() {
    var finalValue = (parseFloat(creditValueNumber.value) * 0.2) + parseFloat(creditValueNumber.value);
    finalValueSpan.innerHTML = finalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    var paymentValue = finalValue / paymentsAmount.value;
    paymentValueSpan.innerHTML = paymentValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    paymentsAmountSpan.innerHTML = paymentsAmount.value;
}

function calculateDates() {
    var daysToSum = parseInt(paymentsAmount.value);
    var lastDate = new Date(firstPaymentDate.value);
    lastDate.setDate(lastDate.getDate() + daysToSum);

    firstPaymentDateSpan.innerHTML = formateAMerdaDaData(firstPaymentDate.value);
    lastPaymentDateSpan.innerHTML = lastDate.toLocaleString("pt-br").split(' ')[0];
}

// Methods para criação de novo débito

var clientData = {
    name: "",
    clientId: ""
}

async function searchCustomers() {
    const customerStr = nameInput.value;

    const searchedCustomers = await fetch(
        `${BASEPATH}/customer/search`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queryString: customerStr, sellerId: sellerId })
        }
    )

    let response = await searchedCustomers.json();

    if (customerStr == "") {
        nameSpan.innerText = ""
    }
    else if (response) {
        nameSpan.innerText = response[0].name

        clientData.name = response[0].name;
        clientData.clientId = response[0]._id;
    }
}

function setData() {
    nameInput.value = clientData.name;
    idInput.value = clientData.clientId;
    nameSpan.innerText = ""
}

async function createCredit() {
    var requestBody = JSON.stringify(
        {
            sellerId: sellerId,
            customerId: clientData.clientId,
            value: parseFloat(creditValueNumber.value),
            paymentsAmount: parseInt(paymentsAmount.value),
            paymentsRemaing: parseInt(paymentsAmount.value)
        }
    );
    
    console.log(requestBody)

    const newCredit = await fetch(
        `${BASEPATH}/debits/create`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }
    );

    let response = await newCredit.json();

    if (response.debitId) {
        alert("Crédito criado com sucesso! Redirecionando para listagem...");
        window.location.href = "../"
    }
}

// Listagem de débitos

async function listCredits() {

    const credits = await fetch(
        `${BASEPATH}/debits/list`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    let response = await credits.json();

    creditList.innerHTML = "";

    response.forEach(credit => {
        var newCredit;
        var name = credit.customerData.name;
        var firstName = name.split(" ")[0];

        if(isMobile) {
            newCredit = `
            <tr>
                <td>${firstName}</td>
                <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}">Pagar</button></td>
            </tr>
            `
        } else {
            newCredit = `
            <tr>
                <td>${credit.customerData.name}</td>
                <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">Pagar</button></td>
            </tr>
            `
        }

        creditList.innerHTML += newCredit;
    });

    addEvents();

}

// Pagamento de débito

var paymentData = {};

function togglePayDebit(e) {

    var payDebitContainer = document.getElementById('pay-debit-container');
    var clientNameEl = document.getElementById('nomeCliente');

    payDebitContainer.classList.toggle('hide');

    paymentData.debitId = e.target.dataset.debitId;
    paymentData.clientName = e.target.dataset.clientName;

    clientNameEl.innerText = paymentData.clientName;

    //console.log(paymentData)
}

async function payDebit() {
    var paidValueEl = document.getElementById('valorPago');

    var requestData = {
        debitId: paymentData.debitId,
        paidValue: parseFloat(paidValueEl.value)
    }

    const payment = await fetch(
        `${BASEPATH}/debits/pay`,
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

    if (response.debitId) {
        window.location.reload();
    }
}

// Calls Gerais

if (creditList) {
    window.addEventListener('load', listCredits)
}

if (nameInput) {
    nameInput.addEventListener('focusout', setData)
}

function addEvents() {
    var payButtons = document.querySelectorAll('.pay-button');

    payButtons.forEach(button => button.addEventListener('click', togglePayDebit));
}