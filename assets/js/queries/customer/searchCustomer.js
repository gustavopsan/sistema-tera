var searchInput = document.getElementById('searchInput');
var customerList = document.getElementById('clientList');

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
                <td><a href="/guarantee/clientes/editar/?cid=${customer._id}"><img src="../../assets/img/icon-edit.svg" alt="icon-edit"></a></td>
            </tr>
            `
        } else {
            newCustomer = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.address.street}, ${customer.address.number} - ${customer.address.hood}, ${customer.address.city} - ${customer.address.uf}</td>
                <td><a href="/guarantee/clientes/editar/?cid=${customer._id}"><img src="../../assets/img/icon-edit.svg" alt="icon-edit"></a></td>
            </tr>
            `
        }
        customerList.innerHTML += newCustomer;
    });
}


searchInput.addEventListener('keyup', searchCustomers);