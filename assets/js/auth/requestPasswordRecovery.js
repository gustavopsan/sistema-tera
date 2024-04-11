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

    if (response.status == "error") {
        let message = 'Nenhuma conta encontrada com os dados informados'

        messageElement.textContent = message;
        messageElement.classList.add("error");
        messageElement.classList.remove("success");

        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    } else {
        let resetPassLink = window.location.hostname + '/reset-password?uid=' + response.userId + '&t=' + response.token;
        
        let subject = "Solicitação de Alteração de Senha"

        let mail = `
            <h2>Olá ${response.userName}!</h2>
            <p>Um pedido de redefinição de senha foi realizado para a sua conta.</p>
            <p>Caso não tenha solicitado essa operação, por favor desconsiderar este email</p>

            <a href="https://${resetPassLink}">Alterar Senha</a>
        `;

        sendMail(email.value, subject, 'alteração de senha', mail)
            .then(response => console.log(response))
            .catch(error => console.log(error));

            let message = 'Um e-mail foi enviado para o endereço cadastrado na conta';

            messageElement.textContent = message;
            messageElement.classList.remove("error");
            messageElement.classList.add("success");

        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    }
}

buttonRequest.addEventListener('click', requestPasswordRecovery);