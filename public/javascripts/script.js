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

    // const term = document.getElementById("city").value;
    // if (term.length < 2) return; // Evitar consultas com menos de 2 caracteres
}

async function autocompleteCbo(data) {
    try {
        let obj = JSON.parse(data)
        obj.forEach(element => {
            console.log(JSON.stringify(element))
        });

        // console.log(obj)

        // obj.forEach(element => {
        //     console.log(element)
        // });
    } catch (error) {
        console.error(error)
    }
}
// Supondo que `dados` seja um array de objetos com os dados do banco
// const fuse = new Fuse(dados, {
//     keys: ['nome'], // Campos onde buscar
//     threshold: 0.3 // Ajuste de sensibilidade de similaridade
// });

// function buscarLocalmente() {
//     const termo = document.getElementById("autocomplete").value;
//     const resultados = fuse.search(termo);
// Exibir os resultados como no exemplo anterior
// }