async function sendMail(email, subject, text, html) {
    const requestData = await fetch(
        `${BASEPATH}/user/sendemail`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                subject: subject,
                text: text,
                html: html
            })
        }
    );

    return requestData.json();
}