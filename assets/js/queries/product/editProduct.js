const Params = new URLSearchParams(window.location.search);
const productId = Params.get("pid");

const productName = document.getElementById("name");
const productValue = document.getElementById("productValue");
const promotionalValue = document.getElementById("promotionalValue");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const productDescription = document.getElementById("description");
const productCategory = document.getElementById("category");
const isActive = document.getElementById("active");
var imagePath;

async function uploadImage() {
    const formData = new FormData();
    const CLIENT_ID = "c68f107bf5ec711";

    formData.append("image", imageInput.files[0]);
    
    const uploadData = await fetch(
        `https://api.imgur.com/3/image`,
        {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Client-ID ${CLIENT_ID}`
            }
        }
    );
    const response = await uploadData.json();

    imagePreview.setAttribute("src", `${response.data.link}`);
    imagePath = response.data.link;
}

async function loadProductData() {
    var requestData = JSON.stringify({
        productId: productId
    })

    const product = await fetch(
        `${BASEPATH}/product/get`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestData
        }
    );

    let response = await product.json();

    if (response._id) {
        productName.value = response.name;
        productValue.value = response.originalValue;
        promotionalValue.value = response.promotionalValue;
        productDescription.value = response.description;
        productCategory.value = response.category;
        isActive.value = response.isActive;
        if (response.imagePath) {
            imagePreview.setAttribute("src", response.imagePath);
            imagePath = response.imagePath;
        } else {
            imagePreview.setAttribute("src", "/assets/img/image-gray.svg");
        }
        imagePath = response.imagePath;
    }
}

window.addEventListener('load', loadProductData);