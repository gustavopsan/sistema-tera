const nameInput = document.getElementById("nameInput");
const cpfcnpjInput = document.getElementById("cpfcnpjInput");
const roleInput = document.getElementById("roleInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const guaranteeInput = document.getElementById("guarantee");
const catalogInput = document.getElementById("catalog");
const erpInput = document.getElementById("erp");
const adminInput = document.getElementById("admin");
const isActiveInput = document.getElementById("isActive");

var modules = [];
var errorContainer = document.getElementById("error-message-container");
var errorMessage = document.getElementById("error-message");

const Params = new URLSearchParams(window.location.search);
const userId = Params.get("uid");

var userData;

async function loadUser() {
    const request = await fetch(
        `${BASEPATH}/user/find`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        }
    );

    let response = await request.json();

    //console.log(response);

    userData = response;

    nameInput.value = response.name;
    cpfcnpjInput.value = response.docId;
    roleInput.value = response.role;
    emailInput.value = response.email;
    phoneInput.value = response.phone;
    isActiveInput.checked = response.isActive;

    if (response.isActive) {
        document.querySelector(".license label").innerHTML = "Ativa";
    } else {
        document.querySelector(".license label").innerHTML = "Inativa";
    }

    modules = response.module;

    response.module.forEach(module => {
        if (module[0] == "guarantee") {
            guaranteeInput.checked = true;
        } else if (module[0] == "catalogo") {
            catalogInput.checked = true;
        } else if (module[0] == "erp") {
            erpInput.checked = true;
        } else if (module[0] == "admin") {
            adminInput.checked = true;
        }
    });
}

var userChanges = [];

function prepareModuleChanges(event) {
    if (event.target.checked) {
        if (!modules.includes(event.target.name)) {
            modules.push([event.target.name]);
            userChanges.push({ userId: userData.id, key: "module", newvalue: modules });
        }
    } else {
        modules.forEach((module, index) => {
            if (module[0] == event.target.name) {
                modules.splice(index, 1);
            }
        })

        userChanges.push({ userId: userData.id, key: "module", newvalue: modules });
    }

    //console.log(userChanges);
}

function prepareChanges(event) {
    var change = {
        userId: userData.id,
        key: event.target.name,
        newvalue: event.target.value
    };

    userChanges.push(change);

    //console.log(userChanges);
}

function handleActivate(event) {
    switch (event.target.checked) {
        case true:
            userChanges.push({ userId: userData.id, key: "isActive", newvalue: true });
            document.querySelector(".license label").innerHTML = "Ativa";
            break;
        case false:
            userChanges.push({ userId: userData.id, key: "isActive", newvalue: false });
            document.querySelector(".license label").innerHTML = "Inativa";
            break;
    }

    //console.log(userChanges);
}

function sendChanges() {
    if (userChanges.length > 0) {
        userChanges.forEach(async change => {
            const updatedUser = await fetch(
                `${BASEPATH}/user/update`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(change)
                }
            );

            let response = await updatedUser.json();

            if (response._id) {
                window.location.pathname = "/admin/";
            }
        })
    } else {
        errorMessage.innerHTML = "Nenhuma alteração feita nos dados do cliente"
        errorContainer.style.display = "flex";

        setTimeout(() => { errorContainer.style.display = "none"; }, 3000)
    }
}

window.addEventListener('load', loadUser);