const email = document.getElementById('emailInput');
const buttonRequest = document.getElementById('buttonRequest');
const messageElement = document.getElementById('error-message');
const errorMessageContainer = document.getElementById('error-message-container');

async function requestPasswordRecovery() {
    const requestBody = JSON.stringify({
        email: email.value
    })

    const requestData = await fetch(
        `${BASEPATH}/user/requestPasswordRecovery`,
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

    //console.log(response);

    if (response.status == "error") {
        let message = 'Nenhuma conta encontrada com os dados informados'

        messageElement.textContent = message;

        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    } else {
        let resetPassLink = window.location.hostname + '/reset-password?uid=' + response.userId + '&t=' + response.token;
        console.log(resetPassLink);
    }
}

buttonRequest.addEventListener('click', requestPasswordRecovery);