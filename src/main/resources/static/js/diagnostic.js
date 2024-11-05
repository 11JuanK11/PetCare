    document.addEventListener('DOMContentLoaded', () => {
            loadMedications();
        });

    function loadMedications() {
        fetch('/rest/medications/')
            .then(response => response.json())
            .then(medications => {
                const form = document.getElementById('medicationForm');
                form.innerHTML = '';

                medications.forEach(medication => {
                    const div = document.createElement('div');
                    div.classList.add('form-check');

                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.classList.add('form-check-input');
                    input.value = medication.name;
                    input.id = `medication_${medication.id}`;
                    input.dataset.id = medication.id;
                    input.addEventListener('change', toggleAdditionalFields);

                    const label = document.createElement('label');
                    label.classList.add('form-check-label');
                    label.setAttribute('for', `medication_${medication.id}`);
                    label.textContent = medication.name;

                    const extraFieldsDiv = document.createElement('div');
                    extraFieldsDiv.classList.add('additional-fields');
                    extraFieldsDiv.style.display = 'none';
                    extraFieldsDiv.setAttribute('id', `extraFields_${medication.id}`);

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(extraFieldsDiv);
                    form.appendChild(div);
                });
            })
            .catch(error => console.error('Error al cargar la lista de medicamentos:', error));
    }

    function toggleAdditionalFields(event) {
        const medicationId = event.target.id.split('_')[1];
        const extraFieldsDiv = document.getElementById(`extraFields_${medicationId}`);

        if (event.target.checked) {
            extraFieldsDiv.style.display = 'block';

            if (extraFieldsDiv.innerHTML === '') {
                const amountInput = document.createElement('input');
                amountInput.type = 'text';
                amountInput.classList.add('form-control', 'mb-2');
                amountInput.placeholder = 'Amount';
                amountInput.name = `amount_${medicationId}`;

                const descriptionInput = document.createElement('input');
                descriptionInput.type = 'text';
                descriptionInput.classList.add('form-control', 'mb-2');
                descriptionInput.placeholder = 'Description';
                descriptionInput.name = `description_${medicationId}`;

                extraFieldsDiv.appendChild(amountInput);
                extraFieldsDiv.appendChild(descriptionInput);
            }
        } else {
            extraFieldsDiv.style.display = 'none';
        }
    }

    document.getElementById('newDiagnostic').addEventListener('click', (e) => {
            e.preventDefault();
            collectMedicationData();
            addDiagnostic();
    });


    function collectMedicationData() {
        const selectedMedications = [];

        document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
            const medicationId = checkbox.dataset.id;
            const extraFieldsDiv = document.getElementById(`extraFields_${medicationId}`);

            const amount = extraFieldsDiv.querySelector(`input[name="amount_${medicationId}"]`).value;
            const description = extraFieldsDiv.querySelector(`input[name="description_${medicationId}"]`).value;

            selectedMedications.push({
                description: description,
                amount: amount,
                medication:{
                    id: medicationId
                },
                recipe:{
                    id: 0
                }
            });
        });
        localStorage.setItem('selectedMedications', JSON.stringify(selectedMedications));
        console.log('Medications saved to localStorage:', selectedMedications);
    }

function addDiagnostic() {
        const diagnosticDate = document.getElementById('diagnosticDate').value;
        const diagnosticDescription = document.getElementById('diagnosticDescription').value;

        const recipe = {}
        fetch('/rest/recipe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
        .then(response => response.json())
        .then(recipe => {
            const idRecipe = recipe.id;
            const idMedicalHistory = localStorage.getItem('idMedicalHistory');

            const diagnostic = {
                description: diagnosticDescription,
                recipe: {
                    id: idRecipe
                },
                date: diagnosticDate
            };

            fetch(`/rest/diagnostics/${idMedicalHistory}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diagnostic)
            })
            .then(response => {
                console.log('Successfully added diagnostic');
            })
            .catch(error => {
                console.error('Error adding diagnostic:', error);
                Swal.fire('Error', error.message || 'Could not add diagnostic.', 'error');
            });

            modifyStoredMedicationData(idRecipe);
            sendMedicationData();
        })
        .catch(error => {
            console.error('Error adding recipe:', error);
            Swal.fire('Error', error.message || 'Could not add diagnostic.', 'error');
        });
    }


    function modifyStoredMedicationData(id) {
        const storedData = localStorage.getItem('selectedMedications');
        if (storedData) {
            let medications = JSON.parse(storedData);

            medications = medications.map(medication => {
                medication.recipe.id = id;
                return medication;
            });

            localStorage.setItem('selectedMedications', JSON.stringify(medications));
            console.log('Modified medications:', medications);
        } else {
            console.log('No medication data found to modify.');
        }
    }


    function sendMedicationData() {
        const storedData = localStorage.getItem('selectedMedications');

        if (storedData) {
            const medications = JSON.parse(storedData);

            fetch('/rest/dose/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medications)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Could not add diagnostic.');
                    });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire('Success', 'Diagnostic added successfully', 'success')
                .then((result) => {
                    if (result.isConfirmed) {
                        // Recargar la página después de confirmar
                        location.reload();
                    }
                });

                const modalElement = document.getElementById('exampleModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                } else {
                    bootstrap.Modal.getOrCreateInstance(modalElement).hide();
                }

                console.log('Medications sent successfully:', data);
            })
            .catch(error => {
                console.error('Error adding recipe:', error);
                Swal.fire('Error', error.message || 'Could not add diagnostic.', 'error');
            });
        } else {
            console.log('No medications to send.');
        }
    }

