async function fetchCities() {
    const state = document.getElementById("state").value;
    // location.href = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
    let data = await response.json()
    let json = JSON.stringify(data)
    console.log(data)
    console.log(json)

    const cities = data
    let select = document.getElementById('city')
    cities.forEach(city => {
        let option = document.createElement('option')
        option.innerHTML = city.nome
        select.appendChild(option)
    })
}

const parentEl = document.querySelector("#autocompleteWrapper")
const inputEl = document.querySelector("#autocompleteInput") 

window.cbo = JSON.parse(window.cbo)
inputEl.addEventListener('input', (e) => onInputChange(window.cbo, "title", e.target.value))

function onInputChange(objList, key, inputValue) {
    removeAutocompletDropdown()
    const value = inputValue.toLowerCase();
    if (value.length  < 2 ) return;
    const filteredNames = [];
    objList.forEach(element => {
        if(removeAccents(element[key].substring(0,value.length).toLowerCase()) === removeAccents(value)) {
            filteredNames.push(element)
        }
    });
    createAutocompletDropdown(filteredNames,'title' ,parentEl)
}

function createAutocompletDropdown(list, key, parentEl) {
    const listEl = document.createElement('ul')
    // listEl.className = ''
    listEl.id = 'autocompleteList'
    list.forEach(element => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.addEventListener('click', onDropdownClick)
        button.innerHTML = element[key]
        listItem.appendChild(button)
        listEl.appendChild(listItem)
    });
    parentEl.appendChild(listEl)
}

function removeAutocompletDropdown() {
    const listEl = document.querySelector('#autocompleteList')
    if(listEl) listEl.remove()
}

function onDropdownClick(e) {
    e.preventDefault();
    const button = e.target;
    inputEl.value = button.innerHTML
    removeAutocompletDropdown()
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}