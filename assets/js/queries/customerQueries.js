const customerList = document.getElementById('clientList');
const searchInput = document.getElementById('searchInput');
const sellerId = getCookie('sellerId');

const formName = document.getElementById('nameInput');
const formCPF = document.getElementById('cpfcnpjInput');
const formStreet = document.getElementById('streetInput');
const formNumber = document.getElementById('numberInput');
const formCity = document.getElementById('cityInput');
const formHood = document.getElementById('hoodInput');
const formState = document.getElementById('stateInput');
const formReference = document.getElementById('referenceInput');
const formModel = document.getElementById('modelInput');
const formPhone = document.getElementById('phoneInput');
const formCadastro = document.getElementById('form-cadastro');

const messageElement = document.getElementById('error-message');
const errorMessageContainer = document.getElementById('error-message-container');

async function listCustomers() {

    const customers = await fetch(
        `${BASEPATH}/customer/list`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    let response = await customers.json();
    
    customerList.innerHTML = "";

    response.forEach(customer => {
        var newCustomer;

        if (isMobile) {
            newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number}</td>
            </tr>
            `
        } else {
            newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number} - ${customer.address.hood}, ${customer.address.city} - ${customer.address.uf}</td>
            </tr>
            `
        }
        
        customerList.innerHTML += newCustomer;
    });
}

async function searchCustomers() {
    const customerStr = searchInput.value;

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

    customerList.innerHTML = "";

    response.forEach(customer => {
        var newCustomer;

        if (isMobile) {
            newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number}</td>
            </tr>
            `
        } else {
            newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number} - ${customer.address.hood}, ${customer.address.city} - ${customer.address.uf}</td>
            </tr>
            `
        }
        customerList.innerHTML += newCustomer;
    });
}

async function createCustomer() {
    let customerData = JSON.stringify({
        sellerId: sellerId,
        name: formName.value,
        address: {
            street: formStreet.value,
            number: formNumber.value,
            hood: formHood.value,
            city: formCity.value,
            uf: formState.value,
            reference: formReference.value
        },
        docId: formCPF.value,
        phone: formPhone.value,
        route: 0
    })

    const newCustomer = await fetch(
        `${BASEPATH}/customer/create`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: customerData
        }
    );

    let response = await newCustomer.json();

    if(response.keyPattern.docId) {
        let message = "Cliente com mesmo CPF já cadastrado";
        messageElement.textContent = message;
        
        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    } else {
        window.location.pathname = '/guarantee/clientes'
    }
}

if (customerList) {
    window.addEventListener('load', listCustomers);
    searchInput.addEventListener('keyup', searchCustomers);
}

if (formCadastro) {
    formCadastro.addEventListener('submit', createCustomer);
}