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
            <img src="${product.imagePath}" alt="image" class="item-image">
            <div class="item-info">
                <b>${product.name}</b>
                <div>
                <span>R$ ${parseFloat(product.promotionalValue)}</span>
                    <button class="list-item-button">
                        <img src="/assets/img/pen.svg" alt="edit">
                    </button>
                </div>
            </div>
        `;

        listContainer.appendChild(newProduct);
    })
}

window.onload = listProducts;