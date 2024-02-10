const email = document.getElementById('emailInput');
const buttonRequest = document.getElementById('buttonRequest');

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

    console.log(response);
}

buttonRequest.addEventListener('click', requestPasswordRecovery);