document.addEventListener('DOMContentLoaded', () => {
    loadMedications();

});

function loadMedications() {
    fetch('/medications/')
        .then(response => response.json())
        .then(medications => {
            const medicationList = document.getElementById('medicationList');
            medicationList.innerHTML = '';

            medications.forEach(medication => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${medication.id}</td>
                    <td>${medication.name}</td>
                    <td>${medication.unitPrice}</td>
                    <td>${medication.stock}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editMedication(${medication.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteMedication(${medication.id})">Delete</button>
                    </td>
                `;
                medicationList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading medications:', error);
            Swal.fire('Error', 'Could not load medications.', 'error');
        });
}


document.getElementById('medicationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addMedication();
});

function addMedication() {
    const name = document.getElementById('medicationName').value;
    const unitPrice = parseInt(document.getElementById('medicationPrice').value);
    const stock = parseInt(document.getElementById('medicationStock').value);

    const medication = {
        name: name,
        unitPrice: unitPrice,
        stock: stock
    };

    fetch('/medications/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(medication)
    })
    .then(response => {
        if (response.ok) {
            loadMedications();
            document.getElementById('medicationForm').reset();
            Swal.fire('Success', 'Medication added successfully', 'success');
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => {
        console.error('Error adding medication:', error);
        Swal.fire('Error', 'Could not add medication.', 'error');
    });
}


function deleteMedication(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this medication!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/medications/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    loadMedications();
                    Swal.fire('Deleted!', 'Medication has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting medication.');
                }
            })
            .catch(error => {
                console.error('Error deleting medication:', error);
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
}

function editMedication(id) {
    localStorage.setItem('medicationIdToEdit', id);
    window.location.href = 'editMedication.html';
}
