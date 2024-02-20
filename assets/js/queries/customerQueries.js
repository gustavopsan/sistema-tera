const customerList = document.getElementById('clientList');

async function listCustomers() {
    const sellerId = getCookie('sellerId');

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

    const response = await customers.json();

    response.forEach(customer => {
        let newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number}</td>
            </tr>
        `
        customerList.innerHTML += newCustomer;
    });
}

window.addEventListener('load', listCustomers);