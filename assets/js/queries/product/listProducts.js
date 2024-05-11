const listContainer = document.getElementById('listContainer');

async function listProducts() {
    const requestData = await fetch(
        `${BASEPATH}/product/list`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sellerId: sellerId
            })
        }
    );

    const products = await requestData.json();

    listContainer.innerHTML = "";

    products.forEach(product => {
        console.log(product);

        var newProduct = document.createElement('div');
        newProduct.setAttribute('class', 'list-item');

        newProduct.innerHTML = `
            <img src="${product.imagePath + '?width=150' ?? '/assets/img/image-gray.svg'}" alt="image" class="item-image">
            <div class="item-info">
                <b>${product.name}</b>
                <div>
                    <span>${product.originalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                    <a href="/catalogo/produtos/editar?pid=${product._id}" class="list-item-button">
                        <img src="/assets/img/pen.svg" alt="edit">
                    </a>
                </div>
            </div>
        `;

        listContainer.append(newProduct);
    })
}

window.onload = listProducts;