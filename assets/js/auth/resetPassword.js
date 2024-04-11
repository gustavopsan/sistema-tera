const params = new URLSearchParams(document.location.search);
const token = params.get("t");
const userId = params.get("uid");

const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const buttonRequest = document.getElementById('buttonRequest');
const messageElement = document.getElementById('error-message');
const errorMessageContainer = document.getElementById('error-message-container');

async function resetPassword() {

    if (passwordInput.value == "" || confirmPasswordInput.value == "") {
        let message = 'Senha ou confirmação não podem estar vazios. Tente novamente!'

        messageElement.textContent = message;
        messageElement.classList.add("error");
        messageElement.classList.remove("success");

        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        let message = 'Senha e confirmação não conferem. Tente novamente!'

        messageElement.textContent = message;
        messageElement.classList.add("error");
        messageElement.classList.remove("success");

        errorMessageContainer.style.display = 'flex';

        setTimeout(() => { 
            errorMessageContainer.style.display = 'none'; 
        }, 3000);
    } else {
        const requestBody = JSON.stringify({
            userId: userId,
            token: token,
            newPassword: passwordInput.value
        })

        const requestData = await fetch(
            `${BASEPATH}/user/resetpassword`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            }
        );

        const response = requestData.json();

        if (response.status == "error") {
            let message = 'Solicitação inválida ou expirada. Inicie uma nova solicitação.'

            messageElement.textContent = message;
            messageElement.classList.add("error");
            messageElement.classList.remove("success");

            errorMessageContainer.style.display = 'flex';

            setTimeout(() => { 
                window.location.pathname = '/esqueci-minha-senha';
            }, 3000)
        } else {
            window.location.pathname = '/login';
        }
    }

}

buttonRequest.addEventListener('click', resetPassword);