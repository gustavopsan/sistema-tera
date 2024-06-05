const filterButton = document.getElementById('filter');
const paymentList = document.getElementById('paymentList');
const paidValueEl = document.getElementById('paid-value');
const valueEl = document.getElementById('valueEl');
const valueDesc = document.getElementById('valueDesc');
const iconEl = document.querySelector('.entry-el');
const filterTypeEl = document.getElementById('filterType');

function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}`
}

var initialDate;
var finalDate;
var filterType = filterTypeEl.value;

function handleInitialDateChange(event) {
    initialDate = new Date(event.target.value).toISOString();
}

function handleFinalDateChange(event) {
    var newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 23, 59, 59);  
    
    finalDate = newDate.toISOString(); 
}

function handleFilterTypeChange(event) {
    filterType = event.target.value;

    if (filterType === "payment") {
        iconEl.classList.add("green");
        iconEl.classList.remove("orange");

        valueDesc.textContent = "Valor recebido nesse período";
    } else if (filterType === "debit") {
        iconEl.classList.add("orange");
        iconEl.classList.remove("green");

        valueDesc.textContent = "Valor liberado nesse período";
    }
}

async function filterCredits() {
    var requestBody = {
        initialDate: initialDate,
        finalDate: finalDate,
        sellerId: sellerId,
        filterType: filterType
    };

    console.log(requestBody);

    const data = await fetch(
        `${BASEPATH}/debits/filter`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }
    );

    let response = await data.json();

    paymentList.innerHTML = "";

    response.payments.forEach(payment => {
        var newPayment;
        var date = new Date(payment.paymentDate || payment.debitDate);
        date.setHours(date.getHours() - 3);

        var parsedDate = date.toISOString().split("T")[0];

        newPayment = `
            <tr>
                <td>${formateAMerdaDaData(parsedDate)}</td>
                <td><span>${payment.clientName}</span></td>
                <td>R$ ${payment.paymentValue || payment.debitValue.$numberDecimal}</td>
            </tr>
        `;

        paymentList.innerHTML += newPayment;
    });

    valueEl.innerHTML = `R$ ${response.totalValue}`;
}
