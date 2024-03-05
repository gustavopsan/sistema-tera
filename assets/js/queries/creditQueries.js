const creditList = document.getElementById("creditList");
const searchInput = document.getElementById('searchInput');
const sellerId = getCookie('sellerId');

const nameInput = document.getElementById('nameInput');
const creditValueNumber = document.getElementById('creditValue');
const daysAmountCont = document.getElementById('diaria-container');
const weeksAmountCont = document.getElementById('semanas-container');
const weeksAmount = document.getElementById('weeksAmount');
const daysAmount = document.getElementById('daysAmount');

const firstPaymentDate = document.getElementById('firstPaymentDate');
const nameSpan = document.getElementById('nameAutocomplete');
const idInput = document.getElementById('idInput');
const paymentModel = document.getElementById('paymentModel');

const finalValueSpan = document.getElementById('finalValueSpan');
const paymentsAmountSpan = document.getElementById('paymentsAmountSpan');
const paymentValueSpan = document.getElementById('paymentValueSpan');
const firstPaymentDateSpan = document.getElementById('firstPaymentDateSpan');
const lastPaymentDateSpan = document.getElementById('lastPaymentDateSpan');
const paymentMethodEl = document.getElementById('paymentMethod');

var paymentsAmount = 0;
var paymentsAmountDisp = 0;

// Nome autoexplicativo
function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

// Setando dados de amostragem no momento de criação do débito
function calculateValue() {

    if (paymentModel.value == 'daily') {
        paymentsAmount = daysAmount.value;
        paymentsAmountDisp = daysAmount.value;
        //console.log(paymentsAmountDisp);
    } else {
        paymentsAmount = weeksAmount.value;
        paymentsAmountDisp = parseInt(paymentsAmount) + 1;
        //console.log(paymentsAmountDisp);
    }

    var finalValue = (parseFloat(creditValueNumber.value) * 0.2) + parseFloat(creditValueNumber.value);
    finalValueSpan.innerHTML = finalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    var paymentValue = finalValue / paymentsAmountDisp;
    paymentValueSpan.innerHTML = paymentValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    paymentsAmountSpan.innerHTML = paymentsAmountDisp;
}

function hideDays() {
    if(paymentModel.value == "weekly") {
       weeksAmountCont.classList.remove('hide');
       daysAmountCont.classList.add('hide');

    } else if(paymentModel.value == "daily") {
        weeksAmountCont.classList.add('hide');
        daysAmountCont.classList.remove('hide');
    }
}

function calculateDates() {
    var weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    var weekDay = weekDays[new Date(firstPaymentDate.value).getDay() + 1];
    var daysToSum = parseInt(paymentsAmount);
    var lastDate = new Date(firstPaymentDate.value);

    if (paymentModel.value == 'daily') {
        switch (weekDay) {
            case 'seg':
                if (daysToSum > 6 && daysToSum < 13) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 13 && daysToSum < 19) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 18) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;

            case 'ter':
                if (daysToSum > 5 && daysToSum < 12) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 12 && daysToSum < 18) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 17) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;
        
            case 'qua':
                if (daysToSum > 4 && daysToSum < 11) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 11 && daysToSum < 17) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 16) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;

            case 'qui':
                if (daysToSum > 3 && daysToSum < 10) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 10 && daysToSum < 16) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 15) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;
            
            case 'sex':
                if (daysToSum > 2 && daysToSum < 9) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 9 && daysToSum < 15) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 14) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;

            case 'sab':
                if (daysToSum > 1 && daysToSum < 8) {
                    daysToSum = daysToSum + 1;
                } else if (daysToSum > 8 && daysToSum < 14) {
                    daysToSum = daysToSum + 2;
                } else if (daysToSum > 13) {
                    daysToSum = daysToSum + 3
                }

                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;

            default:
                lastDate.setDate(lastDate.getDate() + daysToSum);
                break;
        }
    } else {
        var weeksAmount = parseInt(paymentsAmount);
        var lastDate = new Date(firstPaymentDate.value);

        if (weekDay == 'seg') {
            lastDate.setDate(lastDate.getDate() + ((weeksAmount * 7) + 1));
        } else {
            lastDate.setDate(lastDate.getDate() + (weeksAmount * 7));
        }
    }

    

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
            firstPaymentDate: new Date(firstPaymentDate.value),
            paymentModel: paymentModel.value,
            paymentsAmount: parseInt(paymentsAmountDisp),
            paymentsRemaing: parseInt(paymentsAmountDisp)
        }
    );

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
                <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">Pagar</button></td>
            </tr>
            `
        } else {
            newCredit = `
            <tr>
                <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
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

}

async function payDebit() {
    var paidValueEl = document.getElementById('valorPago');

    var requestData = {
        debitId: paymentData.debitId,
        paidValue: parseFloat(paidValueEl.value),
        paymentMethod: paymentMethodEl.value
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

function addEvents() {
    var payButtons = document.querySelectorAll('.pay-button');

    payButtons.forEach(button => button.addEventListener('click', togglePayDebit));
}

async function showDebitInfo() {
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
    
    //console.log(response);

    payDebitButton.dataset.debitId = response.debitId;
    payDebitButton.dataset.clientName = response.customerData.name;
    nameEl.innerHTML = response.customerData.name;
    totalValueEl.innerHTML = response.totalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    paymentsAmountEl.innerHTML = response.paymentsAmount;
    paymentValueEl.innerHTML = (response.totalValue / response.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    paidValueEl.innerHTML = (response.totalValue - response.valueRemaing).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    paymentsRemaingEl.innerHTML = response.paymentsRemaing;
    valueRemaingEl.innerHTML = response.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    
    if (response.paymentModel == "daily") { paymentModelEl.innerHTML = "Diária" }
    else if (response.paymentModel == "weekly") { paymentModelEl.innerHTML = "Semanal" };

    let date = response.firstPaymentDate.toString().split('T')[0];
    firstPaymentDateEl.innerHTML = formateAMerdaDaData(date);

    response.payments.forEach(payment => {
        var date = new Date(payment[0].date).toLocaleString('pt-BR');
        console.log(date);
        var dateValue = date.split(',')[0]
        var item = `<tr><td>${dateValue.split(' ')[0]}</td><td>${payment[0].paymentMethod}</td><td>${payment[0].value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td></tr>`;
        
        document.getElementById('payments-list').innerHTML += item;
    })
}

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
        var name = credit.customerData.name;
        var firstName = name.split(" ")[0];

        if (credit.isQuited) {
            if(isMobile) {
                newCredit = `
                <tr class="quited">
                    <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${firstName}</a></td>
                    <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                    <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td></td>
                </tr>
                `
            } else {
                newCredit = `
                <tr class="quited">
                    <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                    <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                    <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td></td>
                </tr>
                `
            }
        } else {
            if(isMobile) {
                newCredit = `
                <tr>
                    <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${firstName}</a></td>
                    <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                    <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">Pagar</button></td>
                </tr>
                `
            } else {
                newCredit = `
                <tr>
                    <td><a href="/guarantee/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                    <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                    <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">Pagar</button></td>
                </tr>
                `
            }
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

// Calls Gerais

if (creditList) {
    window.addEventListener('load', listCredits)
}

if (nameInput) {
    nameInput.addEventListener('focusout', setData)
}

var Params = new URLSearchParams(window.location.search);

if (Params.has('debit')) {
    window.addEventListener('load', showDebitInfo)
}