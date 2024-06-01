var userList = document.getElementById('userList');

async function listUsers() {

    const users = await fetch(
        `${BASEPATH}/user/list`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    let response = await users.json();

    //console.log(response);

    userList.innerHTML = "";

    response.forEach(user => {

        var newUser = `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.isActive ? "Ativa" : "Inativa"}</td>
            <td><a href="/admin/editar-usuario/?uid=${user.userId}"><img src="../../assets/img/icon-edit.svg" alt="icon-edit"></a></td>
        </tr>`

        userList.innerHTML += newUser;
    })
}

window.addEventListener('load', listUsers);