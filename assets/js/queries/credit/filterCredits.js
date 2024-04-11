const filterButton = document.getElementById('filter');
const paymentList = document.getElementById('paymentList');
const paidValueEl = document.getElementById('paid-value');

function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

var initialDate;
var finalDate;

function handleInitialDateChange(event) {
    initialDate = new Date(event.target.value).toISOString();
}

function handleFinalDateChange(event) {
    var newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 23, 59, 59);  
    
    finalDate = newDate.toISOString();
}

async function filterCredits(initialDate, finalDate) {
    var requestBody = {
        initialDate: initialDate,
        finalDate: finalDate,
        sellerId: sellerId
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
        var date = payment.paymentDate.split('T')[0];

        newPayment = `
            <tr>
                <td>${formateAMerdaDaData(date)}</td>
                <td>${payment.clientName}</td>
                <td>R$ ${payment.paymentValue}</td>
            </tr>
        `;

        paymentList.innerHTML += newPayment;
    });

    paidValueEl.innerHTML = `R$ ${response.totalValue}`;
}

filterButton.addEventListener('click', () => {
    filterCredits(initialDate, finalDate);
});
