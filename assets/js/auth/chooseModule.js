const modulesString = getCookie("userModule")

const modulesArray = modulesString.split(",")

const moduleSelector = document.getElementById("moduleSelector");

const moduleInfo = [
    { key: 'personal', name: 'Finança Pessoal'},
    { key: 'guarantee', name: 'Crediário' },
    { key: 'erp', name: 'Empresarial' }
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