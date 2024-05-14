const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
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

async function loadBannerImage() {
    const catalogRequest = await fetch(
        `${BASEPATH}/cataloginfo/get`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    const catalogData = await catalogRequest.json();

    console.log(catalogData);

    imagePreview.setAttribute("src", `${catalogData.topoBannerUrl}`);
}

async function handleCatalogBanner() {
    const updatedCatalog = await fetch(
        `${BASEPATH}/cataloginfo/update`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sellerId: sellerId,
                key: "topoBannerUrl",
                newvalue: imagePath
            })
        }
    );

    let response = await updatedCatalog.json();

    if (response._id) {
        console.log(response)
    }
}

window.addEventListener('load', loadBannerImage);