const paymentsTodayEl = document.getElementById('payments-today');
const paymentsWeekEl = document.getElementById('payments-week');
const creditsTodayEl = document.getElementById('credits-today');
const creditsWeekEl = document.getElementById('credits-week');
const paymentsMonthEl = document.getElementById('payments-month');
const creditsMonthEl = document.getElementById('credits-month');

async function loadGeneralData() {

    var requestBody = JSON.stringify(
        {
            sellerId: sellerId
        }
    );

    const data = await fetch(
        `${BASEPATH}/debits/loadgeneraldata`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }
    );

    let response = await data.json();

    console.log(response);

    if (response) {
        paymentsTodayEl.innerHTML = response.paymentsToday.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        paymentsWeekEl.innerHTML = response.paymentsThisWeek.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        paymentsMonthEl.innerHTML = response.paymentsThisMonth.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        creditsTodayEl.innerHTML = response.creditsToday.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        creditsWeekEl.innerHTML = response.creditsThisWeek.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        creditsMonthEl.innerHTML = response.creditsThisMonth.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

}

window.addEventListener('load', loadGeneralData);