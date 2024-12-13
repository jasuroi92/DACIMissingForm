function nuevoProyecto() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please, enter a username.');
        return;
    }
    localStorage.setItem('username', username);
    window.location.href = 'daciForm.html'
}


// FUNCIÓN PARA RECUPERAR LA INFORMACIÓN DEL JSON MEDIANTE LOAD FILE

document.getElementById('loadFormButton').addEventListener('click', function () {

    

    const fileInput = document.getElementById('loadFormFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please, select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const formData = JSON.parse(event.target.result);

        // Guardar los datos en localStorage para que daciForm.html pueda usarlos
        localStorage.setItem('loadedFormData', JSON.stringify(formData));
        window.location.href = 'daciForm.html';
    };
    reader.readAsText(file);
});
