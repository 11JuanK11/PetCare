document.addEventListener('DOMContentLoaded', () => {
    loadTreatments();
    loadDiagnostics();

    document.getElementById('treatmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addTreatment();
    });

});

function loadDiagnostics() {
    fetch('/diagnostics/')
        .then(response => response.json())
        .then(diagnostics => {
            const diagnosticSelect = document.getElementById('diagnosticId');
            diagnosticSelect.innerHTML = '<option value="">Select Diagnostic</option>';
            diagnostics.forEach(diagnostic => {
                const option = document.createElement('option');
                option.value = diagnostic.id;
                option.textContent = diagnostic.description;
                diagnosticSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading diagnostics:', error));
}



function loadTreatments() {
    fetch('/treatments/')
        .then(response => response.json())
        .then(treatments => {
            const treatmentList = document.getElementById('treatmentList');
            treatmentList.innerHTML = '';

            treatments.forEach(treatment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${treatment.id}</td>
                    <td>${treatment.name}</td>
                    <td>${treatment.price}</td>
                    <td>
                        <button class="btn" style="background-color: #95BDFF; border: none;"
                                onclick="editTreatment(${treatment.id})">Edit</button>
                        <button class="btn" style="background-color: #F7C8E0; border: none;"
                                onclick="deleteTreatment(${treatment.id})">Delete</button>
                    </td>
                `;
                treatmentList.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading treatments:', error));
}

function editTreatment(id) {
    localStorage.setItem('treatmentIdToEdit', id);
    window.location.href = 'editTreatment.html';
}

function addTreatment() {
    const name = document.getElementById('treatmentName').value;
    const price = document.getElementById('treatmentPrice').value;
    const diagnosticId = document.getElementById('diagnosticId').value;

    const treatment = {
        name: name,
        price: price,
        diagnostic: { id: diagnosticId }
    };

    fetch('/treatments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatment)
    })
    .then(response => {
        if (response.ok) {
            loadTreatments();
            document.getElementById('treatmentForm').reset();
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => console.error('Error adding treatment:', error));
}

function deleteTreatment(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this treatment!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/treatments/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    loadTreatments();
                    Swal.fire('Deleted!', 'The treatment has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting treatment.');
                }
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
}
