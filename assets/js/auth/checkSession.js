const authenticationUrls = [
    '/login', 
    '/esqueci-minha-senha'
];

const restrictedUrls = [
    '/'
]

window.addEventListener('load', async () => {
    const token = getCookie('sessionToken');

    if (restrictedUrls.includes(window.location.pathname)) {
        if (token) {
            const sessionData = await fetch(
                `${BASEPATH}/user/validatesession`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token
                    })
                }
            );

            const response = await sessionData.json();

            if (response.message === 'jwt expired') {
                eraseCookie('UID');
                eraseCookie('sessionToken');

                window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.href));
            }

        } else {
            window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.href));
        }
    }
})