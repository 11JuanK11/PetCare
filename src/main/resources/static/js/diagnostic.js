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




