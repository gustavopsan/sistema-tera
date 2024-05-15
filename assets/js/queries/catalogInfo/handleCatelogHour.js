const startDay = document.getElementById('startDay');
const endDay = document.getElementById('endDay');
const startHour = document.getElementById('startHour');
const endHour = document.getElementById('endHour');
var loadedHour = false;

async function loadCatalogHour() {
    if (!loadedHour) {
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

        const catalogData = await response.json();

        if (catalogData.openHour) {
            startDay.value = catalogData.openHour.startDay;
            endDay.value = catalogData.openHour.endDay;
            startHour.value = catalogData.openHour.startHour;
            endHour.value = catalogData.openHour.endHour;
            loadedHour = true;
        }
    }
}

async function updateCatalogHour() {
    const updatedCatalog = await fetch(
        `${BASEPATH}/cataloginfo/update`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    sellerId: sellerId,
                    key: "openHour",
                    newvalue: {
                        startDay: startDay.value,
                        endDay: endDay.value,
                        startHour: startHour.value,
                        endHour: endHour.value
                    }
                }
            )
        }
    );

    let response = await updatedCatalog.json();

    if (response._id) {
        window.location.reload();
    }
}

window.addEventListener('load', loadCatalogHour)