const nameInput = document.getElementById('nameInput');
const creditValueNumber = document.getElementById('creditValue');
const totalCreditValueNumber = document.getElementById('totalCreditValue');
const daysAmountCont = document.getElementById('diaria-container');
const weeksAmountCont = document.getElementById('semanas-container');
const weeksAmount = document.getElementById('weeksAmount');
const daysAmount = document.getElementById('daysAmount');
const firstPaymentDate = document.getElementById('firstPaymentDate');
const nameSpan = document.getElementById('nameAutocomplete');
const idInput = document.getElementById('idInput');
const paymentModel = document.getElementById('paymentModel');

const Params = new URLSearchParams(window.location.search);
const customerId = Params.get("cid");

console.log(customerId)

// Nome autoexplicativo
function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
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

// Methods para criação de novo débito

var clientData = {
    name: "",
    clientId: ""
}

async function loadClientData() {
    const response = await fetch(
        `${BASEPATH}/customer/find`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId: customerId })
        }
    )

    let data = await response.json();

    nameSpan.innerText = data.name;
    idInput.value = data._id;
    nameInput.placeholder = "";
    nameInput.value = data.name;

    clientData.name = data.name;
    clientData.clientId = data._id;
}

if (customerId) {
    loadClientData();
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


async function createCustomCredit() {
    var requestBody = JSON.stringify(
        {
            sellerId: sellerId,
            customerId: clientData.clientId,
            value: parseFloat(creditValueNumber.value),
            totalValue: parseFloat(totalCreditValueNumber.value),
            firstPaymentDate: new Date(firstPaymentDate.value),
            paymentModel: paymentModel.value,
            paymentsAmount: parseInt(daysAmount.value),
            paymentsRemaing: parseInt(daysAmount.value)
        }
    );

    const newCredit = await fetch(
        `${BASEPATH}/debits/custom`,
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