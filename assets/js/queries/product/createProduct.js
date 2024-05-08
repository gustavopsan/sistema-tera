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

async function createProduct(e) {
    e.preventDefault();

    const data = {
        sellerId: sellerId,
        name: productName.value,
        originalValue: productValue.value,
        promotionalValue: promotionalValue.value,
        imagePath: imagePath,
        description: productDescription.value,
        category: productCategory.value,
    };

    const requestData = await fetch(
        `${BASEPATH}/product/create`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );

    const response = await requestData.json();

    if(response._id) {
        window.location.href = "/catalogo/produtos";
    } else {
        console.log(response);
    }
}