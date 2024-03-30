const paymentMethodEl = document.getElementById('paymentMethod');

var paymentData = {};


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

function togglePayDebit(e) {

    var payDebitContainer = document.getElementById('pay-debit-container');
    var clientNameEl = document.getElementById('nomeCliente');

    payDebitContainer.classList.toggle('hide');

    if (!payDebitContainer.classList.contains('hide')) {
        paymentData.debitId = e.target.dataset.debitId;
        paymentData.clientName = e.target.dataset.clientName;
    
        clientNameEl.innerText = paymentData.clientName;
    }
    
}