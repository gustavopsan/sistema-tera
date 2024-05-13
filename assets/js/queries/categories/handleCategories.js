var cadastroContainer = document.getElementById('create-category-container');
var categoryList = document.getElementById('categoryList');
var newCategoryName = document.getElementById('newCategoryName');
var categories = null;

console.log(categories)

function handleCreateForm() {
    cadastroContainer.classList.toggle('hidden');
}

async function loadCategories() {
    const request = await fetch(
        `${BASEPATH}/categories/get`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    var response = await request.json();
    
    categoryList.innerHTML = "";

    if (response != null) {
        categories = response.categories;

        categories.forEach((category, index) => {
            var categ = `
            <div class="category-item">
                <span>${category[0].name}</span>
                <button data-category-id="${index}" onclick="removeCategory(event)">X</button>
            </div>
            `;

            categoryList.innerHTML += categ;
        });
    }
}

async function removeCategory(event) {
    var categoryId = event.target.dataset.categoryId;

    let requestCategory = await fetch(
        `${BASEPATH}/product/listCategoryProducts`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId ,category: categoryId })
        }
    )

    let categoryProducts = await requestCategory.json();

    if (categoryProducts.length < 0) {

        categories.splice(categoryId, 1);

        let request = await fetch(
            `${BASEPATH}/categories/update`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sellerId: sellerId,
                    categories: categories
                })
            }
        );

        loadCategories();
    } else {
        alert("Categoria contém produtos ativos")
    }
}

async function createCategory() {
    var newCategory = {
        name: newCategoryName.value,
    };

    console.log(categories, categories.length);

    if (categories.length == null) {

        categories.push(newCategory);

        let requestData = JSON.stringify({
            sellerId: sellerId,
            categories: categories
        });

        let request = await fetch(
            `${BASEPATH}/categories/set`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestData
            }
        );

        console.log(await request.json());

        loadCategories();
        handleCreateForm();

    } else {
        categories.push(newCategory);

        let requestData = JSON.stringify({
            sellerId: sellerId,
            categories: categories
        });

        let request = await fetch(
            `${BASEPATH}/categories/update`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestData
            }
        );

        console.log(await request.json());

        loadCategories();
        handleCreateForm();
    }

}

window.onload = loadCategories;