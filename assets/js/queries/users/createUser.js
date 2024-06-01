const nameInput = document.getElementById("nameInput");
const cpfcnpjInput = document.getElementById("cpfcnpjInput");
const roleInput = document.getElementById("roleInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");

var modules = [];
var errorContainer = document.getElementById("error-message-container");

function addModule(event) {
    if (event.target.checked) {
        modules.push(event.target.name);
    } else {
        modules.splice(modules.indexOf(event.target.name), 1);
    }

    console.log(modules);
}

async function createUser() {
    const userData = {
        name: nameInput.value,
        docId: cpfcnpjInput.value,
        role: roleInput.value,
        module: modules,
        phone: phoneInput.value,
        email: emailInput.value,
        "password": "Ter@#2024",
        "confirmPassword": "Ter@#2024"
    };

    const request = await fetch(
        `${BASEPATH}/user/create`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }
    );

    const response = await request.json();

    if (response.errorId) {
        errorContainer.querySelector("span").innerHTML = response.message;
        errorContainer.style.display = "flex";

        setTimeout(() => {
            errorContainer.style.display = "none";
        }, 3000);
    } else {
        window.location.pathname = "/admin/";
    }
}