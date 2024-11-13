const dateInput = document.getElementById('vaccineDate');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

document.addEventListener("DOMContentLoaded", function () {
    const medicationSelect = document.getElementById("medicationSelect");


    async function loadMedications() {
        try {
            const response = await fetch("/rest/medications/");
            if (!response.ok) {
                throw new Error("Failed to fetch medications");
            }
            const medications = await response.json();
            console.log(medications);

            const vaccines = medications.filter(medication => medication.vaccine);
            console.log(vaccines);

            medicationSelect.innerHTML = `<option value="">Select Vaccine</option>`;
            vaccines.forEach(vaccine => {
                const option = document.createElement("option");
                option.value = vaccine.id;
                option.textContent = vaccine.name;
                medicationSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading medications:", error);
        }
    }

    loadMedications();


    async function loadVaccinationCard(petId) {
        loadPetName(petId);
        try {
            const response = await fetch(`/rest/vaccination-cards/pets/${petId}`);
            if (!response.ok) {
                throw new Error('Vaccination card for the pet was not found.');
            }
            const vaccinationCard = await response.json();
            const vaccinationCardId = vaccinationCard.id;
            loadVaccines(vaccinationCardId);
            localStorage.setItem('idVaccinationCard', vaccinationCardId);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }


    async function loadVaccines(vaccinationCardId) {
        try {
            const response = await fetch(`/rest/vaccines/byVaccinationCard/${vaccinationCardId}`);
            if (!response.ok) {
                throw new Error('No vaccines records found for this vaccination card.');
            }
            const vaccines = await response.json();
            displayVaccines(vaccines);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }


    function displayVaccines(vaccines) {
        const container = document.getElementById('vaccinationCardContainer');
        container.innerHTML = '';

        if (!vaccines || vaccines.length === 0) {
            container.innerHTML = `<p class="text-muted text-center">No vaccination records available for this card.</p>`;
            return;
        }

        vaccines.sort((a, b) => new Date(b.date) - new Date(a.date));
        vaccines.forEach(vaccine => {
            const vaccineCard = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${vaccine.medication.name}</h5>
                        <p class="card-text"><strong>Date:</strong> ${new Date(vaccine.date).toLocaleDateString()}</p>
                        <p class="card-text"><strong>Dose:</strong> ${vaccine.dose} ml</p>
                    </div>
                </div>
            `;
            container.innerHTML += vaccineCard;
        });
    }

    async function loadPetName(petId) {
        try {
            const response = await fetch(`/rest/pets/${petId}`);
            if (!response.ok) {
                throw new Error('Pet not found.');
            }
            const pet = await response.json();
            const title = document.getElementById('vaccinationCardTitle');
            title.textContent = `Vaccination Records - ${pet.name} ${pet.lastname}`;
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }


    window.onload = function () {
        const petId = localStorage.getItem('selectedPetId');
        if (petId) {
            loadVaccinationCard(petId);
        } else {
            alert('No pet ID found.');
        }
    };

});
