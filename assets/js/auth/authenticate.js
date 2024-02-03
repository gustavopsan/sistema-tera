const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');

const buttonLogin = document.getElementById('btn-login');

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
                'ContentType': 'application/json'
            },
            body: requestBody
        }
    );

    const response = await requestData.json();

    console.log(response)
}

buttonLogin.addEventListener('click', authenticate);