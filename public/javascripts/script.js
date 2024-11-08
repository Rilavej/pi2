if (document.querySelector("#state")) {
    document.querySelector("#state").addEventListener('click', () => {
        fetchCities()
        document.querySelector("#city").disabled = false
    });
}

if (document.querySelector("#city")) {
    document.querySelector("#city").addEventListener('input', (e) => onInputChange(
        window.cities, "nome", e, document.querySelector("#autocompleteWrapperCities")
    ));
}

async function fetchCities() {
    const state = document.getElementById("state").value;
    // location.href = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
    window.cities = await response.json()
}

if (window.cbo) try {
    window.cbo = JSON.parse(window.cbo);
} catch (error) {
    console.log(typeof (window.cbo), 'objeto inválido')
}

if (document.querySelector("#autocompleteInput")) {
    document.querySelector("#autocompleteInput").addEventListener('input', (e) =>onInputChange(
        window.cbo, "title", e, document.querySelector("#autocompleteWrapper")
    ));
}

function onInputChange(objList, key, e, parentEl) {
    removeAutocompletDropdown()
    const value = e.target.value.toLowerCase();
    if (value.length < 2) return;
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
    listEl.className = 'autocompleteList'
    // listEl.id = 'autocompleteList'
    filteredNames.forEach(element => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.addEventListener('click', (e) => onDropdownClick(e, inputEl))
        button.innerHTML = element[key]
        listItem.appendChild(button)
        listEl.appendChild(listItem)
    });
    parentEl.appendChild(listEl)
}

function removeAutocompletDropdown() {
    listEl = document.querySelectorAll('.autocompleteList')
    if (listEl) listEl.forEach(element => {
        element.remove()
    }); 
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