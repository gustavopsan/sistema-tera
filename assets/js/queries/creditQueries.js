const creditList = document.getElementById("creditList");
const searchInput = document.getElementById('searchInput');
const sellerId = getCookie('sellerId');

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
            </tr>
            `
        } else {
            newCredit = `
            <tr>
                <td>${credit.customerData.name}</td>
                <td>${(credit.totalValue / credit.paymentsAmount).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                <td>${credit.payments.length} / ${credit.paymentsAmount}</td>
                <td>${credit.valueRemaing.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
            </tr>
            `
        }

        creditList.innerHTML += newCredit;
    });

}

window.addEventListener('load', listCredits)