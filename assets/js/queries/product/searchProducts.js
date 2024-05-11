const searchInput = document.getElementById('searchInput');
const productList = document.getElementById('listContainer');

async function searchProducts() {
    const productStr = searchInput.value;

    const searchedProducts = await fetch(
        `${BASEPATH}/product/search`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queryString: productStr, sellerId: sellerId })
        }
    );

    let response = await searchedProducts.json()

    productList.innerHTML = "";

    response.forEach(product => {
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

        productList.append(newProduct);
    });
}