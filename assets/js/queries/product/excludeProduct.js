const Params = new URLSearchParams(window.location.search);
const productId = Params.get("pid");
const exclusionButton = document.getElementById("delete-button");

async function excludeProduct() {
    const request = await fetch(
        `${BASEPATH}/products/remove`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId })
        }
    )

    let response = await request.json();

    console.log(response);
}

exclusionButton.addEventListener("click", excludeProduct);