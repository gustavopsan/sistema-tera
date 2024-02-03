const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');

const buttonLogin = document.getElementById('btn-login');

function authenticate() {
    console.log({
        email: email.value,
        password: password.value
    })
}

buttonLogin.addEventListener('click', authenticate);