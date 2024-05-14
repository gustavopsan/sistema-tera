var cadastroContainer = document.getElementById('create-category-container');
var categoryWarningContainer = document.getElementById('category-warning-container');
var categoryList = document.getElementById('categoryList');
var newCategoryName = document.getElementById('newCategoryName');
var categories = null;

console.log(categories)

function handleCreateForm() {
    cadastroContainer.classList.toggle('hidden');
}

function handleCategoryWarning() {
    categoryWarningContainer.classList.toggle('hidden');
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

    console.log(response)
    
    categoryList.innerHTML = "";

    if (response != null) {
        categories = response.categories;

        if (response.categories.length > 0){
            categories.forEach((category, index) => {
                var categ = `
                <div class="category-item">
                    <span>${category[0].name}</span>
                    <button data-category-id="${index}" data-category-name="${category[0].name}" onclick="removeCategory(event)">X</button>
                </div>
                `;
    
                categoryList.innerHTML += categ;
            });
        } else {
            categories = [];
        }
    }
}

async function removeCategory(event) {
    var categoryId = event.target.dataset.categoryId;
    var categoryName = event.target.dataset.categoryName;

    let requestCategory = await fetch(
        `${BASEPATH}/product/listCategoryProducts`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId, category: categoryName })
        }
    )

    let categoryProducts = await requestCategory.json();

    console.log(categoryProducts.length)

    if (categoryProducts.length <= 0) {

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
        handleCategoryWarning();
    }
}

async function createCategory() {
    var newCategory = {
        name: newCategoryName.value,
    };

    if (categories == null) {

        categories = []; 

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