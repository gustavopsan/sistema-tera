var catalogNameInput = document.getElementById('catalogName');
var wppNumberInput = document.getElementById('wppNumber');
var instaLinkInput = document.getElementById('instaLink');
var isSetted = false;

async function getCatalogInfo() {
    const response = await fetch(
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

    const data = await response.json();

    console.log(data);

    if (data.message == 'CATALOG_NOT_FOUND') {
        isSetted = false;
    } else {
        isSetted = true;

        catalogNameInput.value = data.catalogName;
        wppNumberInput.value = data.whatsappNumber;
        instaLinkInput.value = data.instaLink;
    }
};

async function updateCatalogInfo() {

    if (!isSetted) {
        const response = await fetch(
            `${BASEPATH}/cataloginfo/create`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        sellerId: sellerId, 
                        whatsappNumber: wppNumberInput.value, 
                        instaLink: instaLinkInput.value, 
                        catalogName: catalogNameInput.value, 
                        topoBannerUrl: "", 
                        openHour: []
                    }
                )
            }
        );

        const data = await response.json();

        if (data._id) {
            window.location.href = "/catalogo/info";
        }
    } else {
        
    }
}

window.addEventListener('load', getCatalogInfo)