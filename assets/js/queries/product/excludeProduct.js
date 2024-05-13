const exclusionButton = document.getElementById("delete-button");

async function excludeProduct() {
    const request = await fetch(
        `${BASEPATH}/product/remove`,
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