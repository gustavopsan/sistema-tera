const authenticationUrls = [
    '/login', 
    '/esqueci-minha-senha'
];

const guaranteeUrls = [
    '/guarantee/',
    '/guarantee/clientes',
    '/guarantee/clientes/editar',
    '/guarantee/clientes/novo',
    '/guarantee/clientes/resumo',
    '/guarantee/crediarios',
    '/guarantee/crediarios/informativo',
    '/guarantee/crediarios/novo',
    '/guarantee/despesas',
    '/guarantee/despesas/nova',
    '/guarantee/relatorios'
];

const catalogUrls = [
    '/catalogo/',
    '/catalogo/banner',
    '/catalogo/categorias',
    '/catalogo/horarios',
    '/catalogo/info',
    '/catalogo/pagamento',
    '/catalogo/produtos',
    '/catalogo/produtos/editar',
    '/catalogo/produtos/novo',
];

const adminUrls = [
    '/admin/',
    '/admin/novo-usuario',
    '/admin/editar-usuario'
];

window.addEventListener('load', async () => {
    const token = getCookie('sessionToken');

    if (!authenticationUrls.includes(window.location.pathname)) {
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

            var modules = [];

            response.modules.forEach(module => {
                modules.push(module[0]);
            })

            if (adminUrls.includes(window.location.pathname)) {
                if (!modules.includes('admin')) {
                    window.location.replace('/');
                }
            }
            
            if (catalogUrls.includes(window.location.pathname)) {
                if (!modules.includes('catalogo')) {
                    window.location.replace('/');
                }
            }
            
            if (guaranteeUrls.includes(window.location.pathname)) {
                if (!modules.includes('guarantee')) {
                    window.location.replace('/');
                }
            }
                                                  
            if (document.getElementById('user-name')){
                document.getElementById("user-name").innerText = response.name;
            }

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