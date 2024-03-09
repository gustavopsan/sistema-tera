var customerList = document.getElementById('clientList');

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

window.addEventListener('load', listCustomers);