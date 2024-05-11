var cadastroContainer = document.getElementById('create-category-container');
var categoryList = document.getElementById('categoryList');
var newCategoryName = document.getElementById('newCategoryName');
var categories = [];

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

    categories = response.categories;

    categories.forEach(category => {
        var categ = `
        <div class="category-item">
            <span>${category[0].name}</span>
            <button>X</button>
        </div>
        `;

        categoryList.innerHTML += categ;
    });
}

async function createCategory() {
    var newCategory = {
        name: newCategoryName.value,
    };

    if (categories.length <= 0) {

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

        loadCategories();
        handleCreateForm();
    }

}

window.onload = loadCategories;