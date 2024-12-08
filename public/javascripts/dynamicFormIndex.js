document.getElementById('dynamicForm').style.display = 'none'; //retirar
document.getElementById('imageForm').style.display = 'none'; //retirar

document.querySelectorAll('.delButton').forEach(delButton => {
    delButton.style.display = 'none'; // Retirar
    delButton.addEventListener('click', () => {
        removeField(delButton);
    })
});

document.getElementById('showForm').addEventListener('click', () => {
    const form = document.getElementById('dynamicForm');
    if (form.style.display === 'none') {
        form.style.display = 'block'; // Torna o formulário visível
    }
    form.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById('showImageForm').addEventListener('click', () => {
    const form = document.getElementById('imageForm');
    if (form.style.display === 'none') {
        form.style.display = 'block'; // Torna o formulário visível
    }
    form.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById('addProfession').addEventListener('click', () => {
    const professionContainer = document.getElementById('professionContainer');
    const newFieldUnity = addField(professionContainer);
    if (newFieldUnity) addEventToInputs(newFieldUnity);
});

document.getElementById('addPhone').addEventListener('click', () => {
    const phoneContainer = document.getElementById('phoneContainer');
    addField(phoneContainer);
});

document.getElementById('addLink').addEventListener('click', () => {
    const linkContainer = document.getElementById('linkContainer')
    addField(linkContainer);
});

function addField(container) {
    container.querySelector('.delButton').style.display = 'block';
    const myRow = container.querySelector('.myRow')
    const newFieldUnity = myRow.cloneNode(true);
    // Limpar valores dos campos no novo conjunto e modifica o nome
    const inputs = newFieldUnity.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        if (container.id === 'professionContainer') {
            if (input.className === 'textarea') {
                input.name = `services[${container.childElementCount}][description]`
            } else {
                input.name = `services[${container.childElementCount}][ocupation]`
            }
        }
    });
    // Adicionar o novo conjunto ao container
    container.appendChild(newFieldUnity);
    numberLabels(container)
    AddEventToButtons(newFieldUnity);
    return newFieldUnity;
}

function addEventToInputs(newFieldUnity) {
    const cboInput = newFieldUnity.querySelector('.cboInput')
    cboInput.addEventListener('input', (e) => onInputChange(
        window.cbo, "title", e, cboInput.closest(".autocompleteWrapperCbo")
    ));
    cboInput.addEventListener('click', (e) => onInputChange(
        window.cbo, "title", e, cboInput.closest(".autocompleteWrapperCbo")
    ));
}

function AddEventToButtons(newFieldUnity) {
    const container = newFieldUnity.closest('.myContainer')
    const delButton = newFieldUnity.querySelector('.delButton')
    delButton.addEventListener('click', () => {
        removeField(delButton);
    })
}

function removeField(delButton) {
    const container = delButton.closest('.myContainer')
    if (container.childElementCount === 2) {
        container.querySelectorAll('.delButton').forEach(delButton => {
            delButton.style.display = 'none' // remover
        });
    }
    delButton.closest('.myRow').remove();
    numberLabels(container);
}

function numberLabels(container) {
    if (container.querySelectorAll('.labelNumber').length === 1) {
        container.querySelector('.labelNumber').innerText = null;
    } else {
        container.querySelectorAll('.labelNumber').forEach((label, i) => {
            label.innerText = i + 1
        });
    }
}