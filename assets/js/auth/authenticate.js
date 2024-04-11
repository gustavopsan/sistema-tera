const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');

const buttonLogin = document.getElementById('btn-login');

const errorMessageContainer = document.querySelector('.error-message-container');
const errorMessage = document.getElementById('error-message');

async function authenticate() {
    const requestBody = JSON.stringify({
        email: email.value,
        password: password.value
    })

    const requestData = await fetch(
        `${BASEPATH}/user/auth`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }
    );

    const response = await requestData.json();

    if(response.userData) {
        setCookie("UID",  response.userData.userId, 14);
        setCookie("sessionToken", response.token, 14);
        setCookie("userModule", response.userData.module, 14);
        setCookie("sellerId", response.userData.sellerId, 14);

        window.location.replace('/');
    } else if(response.errorId === 'auth_01') {
        let message = "E-mail incorreto. Verifique e tente novamente.";

        errorMessage.textContent = message;
        
        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);

    } else if (response.errorId === 'auth_02') {
        let message = "Senha inválida. Verifique e tente novamente.";

        errorMessage.textContent = message;
        
        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    }
}

buttonLogin.addEventListener('click', authenticate);

document.getElementById("form-login").addEventListener("keyup", (event) => {
    if (event.code === "Enter") {
        authenticate();
    }
})