var catalogNameInput = document.getElementById('catalogName');
var wppNumberInput = document.getElementById('whatsappNumber');
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


var catalogChanges = [];

function prepareChanges(event) {
    var change = {
        sellerId: sellerId,
        key: event.target.name,
        newvalue: event.target.value
    }

    catalogChanges.push(change);
    console.log(catalogChanges)
}

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
                        openHour: {}
                    }
                )
            }
        );

        const data = await response.json();

        if (data._id) {
            window.location.href = "/catalogo/info";
        }
    } else {
        if (catalogChanges.length > 0) {
            catalogChanges.forEach(async change => {
                const updatedCatalog = await fetch(
                    `${BASEPATH}/cataloginfo/update`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(change)
                    }
                );

                let response = await updatedCatalog.json();

                if (response._id) {
                    window.location.reload();
                }
            })
        } else {
            alert("Nenhuma alteração foi feita");
        }
    }
}

window.addEventListener('load', getCatalogInfo)