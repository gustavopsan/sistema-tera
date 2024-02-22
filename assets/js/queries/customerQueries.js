const customerList = document.getElementById('clientList');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const sellerId = getCookie('sellerId');

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

window.addEventListener('load', listCustomers);
searchInput.addEventListener('keyup', searchCustomers);