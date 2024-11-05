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
                    label.textContent = medication.name + "  -  Available Stock: " + medication.stock;

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
            .catch(error => console.error('Error loading medication list:', error));
    }

    function toggleAdditionalFields(event) {
        const medicationId = event.target.id.split('_')[1];
        const extraFieldsDiv = document.getElementById(`extraFields_${medicationId}`);

        if (event.target.checked) {
            extraFieldsDiv.style.display = 'block';

            if (extraFieldsDiv.innerHTML === '') {

                const amountLabel = document.createElement('label');
                amountLabel.textContent = 'Amount';
                amountLabel.classList.add('form-label');
                const amountAsterisk = document.createElement('span');
                amountAsterisk.textContent = ' *';
                amountAsterisk.style.color = 'red';
                amountLabel.appendChild(amountAsterisk);

                const amountInput = document.createElement('input');
                amountInput.type = 'text';
                amountInput.classList.add('form-control', 'mb-2');
                amountInput.name = `amount_${medicationId}`;

                const descriptionLabel = document.createElement('label');
                descriptionLabel.textContent = 'Description';
                descriptionLabel.classList.add('form-label');
                const descriptionAsterisk = document.createElement('span');
                descriptionAsterisk.textContent = ' *';
                descriptionAsterisk.style.color = 'red';
                descriptionLabel.appendChild(descriptionAsterisk);

                const descriptionInput = document.createElement('input');
                descriptionInput.type = 'text';
                descriptionInput.classList.add('form-control', 'mb-2');
                descriptionInput.name = `description_${medicationId}`;

                extraFieldsDiv.appendChild(amountLabel);
                extraFieldsDiv.appendChild(amountInput);
                extraFieldsDiv.appendChild(descriptionLabel);
                extraFieldsDiv.appendChild(descriptionInput);
            }
        } else {
            extraFieldsDiv.style.display = 'none';
        }
    }

    document.getElementById('newDiagnostic').addEventListener('click', async (e) => {
        e.preventDefault();
        if (validateFields()) {
            collectMedicationData();
            await validateStock();
        }
    });


    function validateFields() {
        const diagnosticDate = document.getElementById('diagnosticDate').value;
        const diagnosticDescription = document.getElementById('diagnosticDescription').value;

        if (!diagnosticDate) {
            Swal.fire('Error', 'The date is required.', 'error');
            return false;
        }

        if (!diagnosticDescription) {
            Swal.fire('Error', 'The description is required.', 'error');
            return false;
        }

        const selectedMedications = document.querySelectorAll('.form-check-input:checked');
        if (selectedMedications.length === 0) {
            Swal.fire('Error', 'Please select at least one medication.', 'error');
            return false;
        }

        let isComplete = true;
        selectedMedications.forEach(checkbox => {
            if(checkbox.dataset.id){
                const medicationId = checkbox.dataset.id;
                const amount = document.querySelector(`input[name="amount_${medicationId}"]`).value;
                const description = document.querySelector(`input[name="description_${medicationId}"]`).value;
                if (!amount || !description) {
                    Swal.fire('Error', 'Please fill in amount and description for each selected medication.', 'error');
                    isComplete = false;
                }
            }
        });

        return isComplete;
    }


    function collectMedicationData() {
        const selectedMedications = [];
        document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {

            if(checkbox.dataset.id){
                const medicationId = checkbox.dataset.id;
                const extraFieldsDiv = document.getElementById(`extraFields_${medicationId}`);

                const amount = extraFieldsDiv.querySelector(`input[name="amount_${medicationId}"]`).value;
                const description = extraFieldsDiv.querySelector(`input[name="description_${medicationId}"]`).value;

                selectedMedications.push({
                    description: description,
                    amount: amount,
                    medication: {
                        id: medicationId
                    },
                    recipe: {
                        id: 0
                    }
                });
            }
        });
        localStorage.setItem('selectedMedications', JSON.stringify(selectedMedications));
    }


    function addDiagnostic() {
        const diagnosticDate = document.getElementById('diagnosticDate').value;
        const diagnosticDescription = document.getElementById('diagnosticDescription').value;

        const recipe = {};
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
            })
            .catch(error => {
                console.error('Error adding recipe:', error);
                Swal.fire('Error', error.message || 'Could not add diagnostic.', 'error');
            });
        }
    }


    async function validateStock() {
        const validate = document.getElementById('validateStock');
        let allValid = true;

        if (validate.checked) {
            const storedData = localStorage.getItem('selectedMedications');

            if (storedData) {
                const doses = JSON.parse(storedData);

                await Promise.all(doses.map(async (dose) => {
                    const medicationId = dose.medication.id;

                    try {
                        const response = await fetch(`/rest/medications/${medicationId}`);
                        const medication = await response.json();

                        if (!(medication.stock >= dose.amount)) {
                            allValid = false;
                            Swal.fire('Error', 'Validate available stock of medicines.', 'error');
                        }
                    } catch (error) {
                        allValid = false;
                        console.error('Error updating medication:', error);
                        Swal.fire('Error', error.message || 'Could not update medication.', 'error');
                    }
                }));

                if (allValid) {
                    await Promise.all(doses.map(async (dose) => {
                        const medicationId = dose.medication.id;
                        const response = await fetch(`/rest/medications/${medicationId}`);
                        const medication = await response.json();
                        medication.stock -= dose.amount;

                        const updateMedication = {
                            name: medication.name,
                            unitPrice: medication.unitPrice,
                            stock: medication.stock
                        };

                        const updateResponse = await fetch(`/rest/medications/${medicationId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateMedication)
                        });

                        if (!updateResponse.ok) {
                            allValid = false;
                            const errorData = await updateResponse.json();
                            throw new Error(errorData.message || 'Could not update medication stock.');
                        }
                    }));
                    addDiagnostic();
                }
            }
        } else {
            addDiagnostic();
        }
    }

