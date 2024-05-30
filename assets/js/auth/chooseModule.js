const modulesString = getCookie("userModule")

const modulesArray = modulesString.split(",")

const moduleSelector = document.getElementById("moduleSelector");

const moduleInfo = [
    { key: 'guarantee', name: 'Crediário' },
    { key: 'erp', name: 'Empresarial' },
    { key: 'catalogo', name: 'Catálogo' },
    { key: 'admin', name: 'Administração' },
]

modulesArray.forEach(moduleApi => {
    let option = document.createElement('option');

    option.value = moduleApi;
    option.textContent = moduleInfo.find(module => module.key === moduleApi).name;

    moduleSelector.appendChild(option);
});

function selectModule() {
    let moduleUrl = moduleSelector.value;

    window.location.pathname = `/${moduleUrl}`;
}