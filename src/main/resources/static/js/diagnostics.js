async function fetchPets() {
    try {
        const response = await fetch('/rest/pets/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const pets = await response.json();
        populateTable(pets);
        hideMessage();
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
}


function populateTable(pets) {
    const tableBody = document.getElementById('petTableBody');
    tableBody.innerHTML = '';
    pets.forEach(pet => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.name}</td>
            <td>${pet.age}</td>
            <td>${pet.race}</td>
            <td>${pet.weight}</td>
            <td>
                <a href="/staff-panel/medicalHistoryStaff/${pet.id}" class="btn btn-sm" style="background-color: #95BDFF; border: none;">View Medical History</a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}



function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.classList.remove('d-none');
}


function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.add('d-none');
}


async function searchPets() {
    const id = document.getElementById('searchId').value;
    const name = document.getElementById('searchName').value;
    let url = '/rest/pets/';


    if (id) {
        const response = await fetch(`/rest/pets/${id}`);
        if (response.ok) {
            const pet = await response.json();
            populateTable([pet]);
            hideMessage();
        } else {
            populateTable([]);
            showMessage(`No pet found with ID: ${id}`);
        }
    }

    else if (name) {
        const response = await fetch(`/rest/pets/name/${name}`);
        if (response.ok) {
            const pets = await response.json();
            if (pets.length > 0) {
                populateTable(pets);
                hideMessage();
            } else {
                populateTable([]);
                showMessage(`No pets found with the name: ${name}`);
            }
        } else {
            populateTable([]);
            showMessage(`Error fetching pets by name.`);
        }
    } else {
        fetchPets();
        hideMessage();
    }
}


window.onload = fetchPets;


document.getElementById('searchId').addEventListener('input', searchPets);
document.getElementById('searchName').addEventListener('input', searchPets);
