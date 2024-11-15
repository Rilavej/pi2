if (window.cbo) try {
    window.cbo = JSON.parse(window.cbo);
} catch (error) {
    console.log(typeof (window.cbo), 'objeto inválido')
}

async function fetchCities() {
    const state = document.getElementById("stateInput").value;
    // location.href = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
    window.cities = await response.json()
}

function onInputChange(objList, key, e, parentEl) {
    removeAutocompletDropdown()
    const value = e.target.value.toLowerCase();
    if (value.length < 1) return;
    const filteredNames = [];
    objList.forEach(element => {
        if (removeAccents(element[key].substring(0, value.length).toLowerCase()) === removeAccents(value)) {
            filteredNames.push(element)
        }
    });
    const inputEl = e.target
    createAutocompletDropdown(filteredNames, key, inputEl, parentEl)
}

function createAutocompletDropdown(filteredNames, key, inputEl, parentEl) {
    const listEl = document.createElement('ul')
    listEl.id = 'autocompleteList'
    filteredNames.forEach(element => {
        const listItem = document.createElement('li');
        listItem.className = 'panel'
        const button = document.createElement('a');
        button.className = 'panel-block'
        button.addEventListener('click', (e) => onDropdownClick(e, inputEl))
        button.innerHTML = element[key]
        listItem.appendChild(button)
        listEl.appendChild(listItem)
    });
    parentEl.appendChild(listEl)
}

function removeAutocompletDropdown() {
    if (document.querySelector('#autocompleteList')) {
        document.querySelector('#autocompleteList').remove()
    }
}

function onDropdownClick(e, inputEl) {
    e.preventDefault();
    const button = e.target;
    inputEl.value = button.innerHTML;
    removeAutocompletDropdown()
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// document.querySelector("#addProfession").addEventListener('click', ()=>{
//     document.querySelector('#finderForm').appendChild(
//     '<input id="cboInput" class="input" name="profession[]" type="text" \
//     placeholder="Nome da categoria" autocomplete="off">'
//     )
// })

if (document.querySelector("#stateInput")) {
    document.querySelector("#stateInput").addEventListener('input', () => {
        document.querySelector("#cityInput").value = null
        fetchCities()
        document.querySelector("#cityInput").disabled = false
    });
}

if (document.querySelector("#cityInput")) {
    document.querySelector("#cityInput").addEventListener('input', (e) => onInputChange(
        window.cities, "nome", e, document.querySelector("#autocompleteWrapperCities")
    ));
    document.querySelector("#cityInput").addEventListener('click', (e) => onInputChange(
        window.cities, "nome", e, document.querySelector("#autocompleteWrapperCities")
    ));
}

if (document.querySelector("#cboInput")) {
    document.querySelector("#cboInput").addEventListener('input', (e) => onInputChange(
        window.cbo, "title", e, document.querySelector("#autocompleteWrapperCbo")
    ));
    document.querySelector("#cboInput").addEventListener('click', (e) => onInputChange(
        window.cbo, "title", e, document.querySelector("#autocompleteWrapperCbo")
    ));
    // nao funciona
    // document.querySelector("#cboInput").addEventListener('blur', removeAutocompletDropdown);
}
