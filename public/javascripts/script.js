if (document.querySelector("#state")) {
    document.querySelector("#state").addEventListener('click', (e) => {
        fetchCities()
        document.querySelector("#city").disabled = false
    });
}

if (document.querySelector("#city")) {
    document.querySelector("#city").addEventListener(
        'input', (e) => onInputChange(
            window.cities, "nome", e.target.value, document.querySelector("#autocompleteWrapperCities"), document.querySelector("city")
        )
    );
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
const parentEl = document.querySelector("#autocompleteWrapper")
const inputEl = document.querySelector("#autocompleteInput")

if (inputEl) inputEl.addEventListener('input', (e) =>
    onInputChange(window.cbo, "title", e.target.value, parentEl, inputEl)
);

function onInputChange(objList, key, inputValue, parentEl, inputEl) {
    removeAutocompletDropdown()
    const value = inputValue.toLowerCase();
    if (value.length < 2) return;
    const filteredNames = [];
    objList.forEach(element => {
        if (removeAccents(element[key].substring(0, value.length).toLowerCase()) === removeAccents(value)) {
            filteredNames.push(element)
        }
    });
    createAutocompletDropdown(filteredNames, key, parentEl, inputEl)
}

function createAutocompletDropdown(list, key, parentEl, inputEl) {
    const listEl = document.createElement('ul')
    // listEl.className = ''
    listEl.id = 'autocompleteList'
    list.forEach(element => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.addEventListener('click', (e) => onDropdownClick(e, inputEl))
        button.innerHTML = element[key]
        listItem.appendChild(button)
        listEl.appendChild(listItem)
    });
    parentEl.appendChild(listEl)
}

function removeAutocompletDropdown(listEl) {
    if (listEl) listEl.remove()
}

function onDropdownClick(e, inputEl) {
    e.preventDefault();
    const button = e.target;
    inputEl.value = button.innerHTML
    removeAutocompletDropdown(inputEl)
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}