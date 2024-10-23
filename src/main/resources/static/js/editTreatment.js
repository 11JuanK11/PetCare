document.addEventListener('DOMContentLoaded', () => {
    const treatmentId = localStorage.getItem('treatmentIdToEdit');
    if (treatmentId) {
        loadTreatmentData(treatmentId);
    }

    loadDiagnostics();

    document.getElementById('treatmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateTreatment(treatmentId);
        }
    });
});

function validateForm() {
    const treatmentName = document.getElementById('treatmentName').value.trim();
    const treatmentPrice = document.getElementById('treatmentPrice').value.trim();
    const diagnosticId = document.getElementById('diagnosticId').value;

    if (!treatmentName || !treatmentPrice || !diagnosticId) {
        Swal.fire({
            title: 'Warning!',
            text: 'All fields are required!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return false;
    }

    return true;
}

function loadDiagnostics() {
    fetch('/rest/diagnostics/')
        .then(response => response.json())
        .then(diagnostics => {
            const diagnosticSelect = document.getElementById('diagnosticId');
            diagnostics.forEach(diagnostic => {
                const option = document.createElement('option');
                option.value = diagnostic.id;
                option.textContent = diagnostic.description;
                diagnosticSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading diagnostics:', error));
}

function loadTreatmentData(id) {
    fetch(`/rest/treatments/${id}`)
        .then(response => response.json())
        .then(treatment => {
            document.getElementById('treatmentName').value = treatment.name;
            document.getElementById('treatmentPrice').value = treatment.price;

            const diagnosticSelect = document.getElementById('diagnosticId');
            diagnosticSelect.value = treatment.diagnostic.id;
        })
        .catch(error => console.error('Error loading treatment data:', error));
}

function updateTreatment(id) {
    const name = document.getElementById('treatmentName').value;
    const price = document.getElementById('treatmentPrice').value;
    const diagnosticId = document.getElementById('diagnosticId').value;

    const treatment = {
        name: name,
        price: price,
        diagnostic: { id: diagnosticId }
    };

    fetch(`/rest/treatments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatment)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Treatment updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('treatmentIdToEdit');
                window.location.href = 'http://localhost:8080/admin-panel/treatments';
            });
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the treatment.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('Error updating treatment:', error);
    });
}
