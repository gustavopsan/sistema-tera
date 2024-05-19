const checkPix = document.getElementById("checkPix");
const checkMoney = document.getElementById("checkMoney");
const checkCard = document.getElementById("checkCard");
const checkTicket = document.getElementById("checkTicket");

const taxList = document.getElementById("taxList");

const createTaxContainer = document.getElementById("create-tax-container");
const newTaxName = document.getElementById("newTaxName");
const newTaxValue = document.getElementById("newTaxValue");

var taxArray = [];

function handleCreateForm() {
    createTaxContainer.classList.toggle("hidden");
}

async function getCatalogInfo() {
    const catalogRequest = await fetch(
        `${BASEPATH}/cataloginfo/get`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    const catalogData = await catalogRequest.json();

    checkPix.checked = catalogData.paymentOptions.pix;
    checkMoney.checked = catalogData.paymentOptions.money;
    checkCard.checked = catalogData.paymentOptions.card;
    checkTicket.checked = catalogData.paymentOptions.ticket;

    taxList.innerHTML = '';

    if (catalogData.deliveryValues.length) {
        taxArray = catalogData.deliveryValues;

        catalogData.deliveryValues.forEach((delivery, index) => {
            var taxItem = `
                <div class="tax-item">
                    <span class="tax-span">${delivery[0].place} - ${delivery[0].value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                    <button data-delivery-index="${index}" onclick="removeDelivery(event)">X</button>
                </div>
            `;

            taxList.innerHTML += taxItem;
        });
    }
    
}

async function handlePaymentOptions(event) {
    var paymentOption = event.target.dataset.format;
    var value = event.target.checked;

    const change = await fetch(
        `${BASEPATH}/cataloginfo/update`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    sellerId: sellerId,
                    key: 'paymentOptions.' + paymentOption,
                    newvalue: value 
                }
            )
        }
    );

    const data = await change.json();

    getCatalogInfo();
}

async function createTax() {
    var newTax = {
        place: newTaxName.value,
        value: parseFloat(newTaxValue.value)
    };

    taxArray.push(newTax);

    const newTaxRequest = await fetch(
        `${BASEPATH}/cataloginfo/update`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    sellerId: sellerId,
                    key: 'deliveryValues',
                    newvalue: taxArray
                }
            )
        }
    );

    const data = await newTaxRequest.json();

    getCatalogInfo();

    newTaxName.value = '';
    newTaxValue.value = '';

    handleCreateForm();
}

async function removeDelivery(event) {
    var deliveryIndex = event.target.dataset.deliveryIndex;
    taxArray.splice(deliveryIndex, 1);

    const removeTaxRequest = await fetch(
        `${BASEPATH}/cataloginfo/update`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    sellerId: sellerId,
                    key: 'deliveryValues',
                    newvalue: taxArray
                }
            )
        }
    );

    const data = await removeTaxRequest.json();

    getCatalogInfo();

}

window.onload = getCatalogInfo