const vetList = document.getElementById("vet-list");
let veterinarians = [];

async function loadVeterinarians() {
    try {
        const response = await fetch("http://localhost:8080/rest/clinic-staff/");
        if (!response.ok) {
            throw new Error("Error fetching veterinarians");
        }
        veterinarians = await response.json();
        veterinarians.forEach(addVetToPanel);
    } catch (error) {
        console.error("Error loading veterinarians:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadVeterinarians);

function addVetToPanel(vet) {
    const vetCard = document.createElement("div");
    vetCard.className = "card vet-card";
    vetCard.draggable = true;
    vetCard.dataset.id = vet.userId;

    vetCard.innerHTML =
        `<div class="card-body">
            <h5 class="card-title">${vet.name} ${vet.lastname}</h5>
            <p class="card-text">ID: ${vet.userId}</p>
        </div>`;

    vetCard.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", vet.userId); // Usar userId
        setTimeout(() => vetCard.classList.add("dragging"), 0);
    };

    vetCard.ondragend = () => {
        vetCard.classList.remove("dragging");
    };

    vetList.appendChild(vetCard);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const vetId = event.dataTransfer.getData("text/plain");
    const slot = event.target;

    if (slot.classList.contains("schedule-cell")) {
        const vet = veterinarians.find(v => v.userId == vetId);
        if (vet) {
            if (slot.classList.contains("slot-filled")) {
                const existingVetId = slot.dataset.vetId;
                const existingVet = veterinarians.find(v => v.userId == existingVetId);
                addVetToPanel(existingVet);
            }

            slot.classList.add("slot-filled");
            slot.innerHTML = `${vet.name} ${vet.lastname}<br>ID: ${vet.userId} <button onclick="removeVetFromSlot('${slot.id}')" class="btn btn-danger btn-sm ms-2">x</button>`;
            slot.dataset.vetId = vetId;

            const vetCard = document.querySelector(`.vet-card[data-id='${vetId}']`);
            if (vetCard) vetCard.remove();

            const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
            schedule[slot.id] = vetId;
            localStorage.setItem("schedule", JSON.stringify(schedule));
        }
    } else {
        const vet = veterinarians.find(v => v.userId == vetId);
        if (vet && !document.querySelector(`.vet-card[data-id='${vetId}']`)) {
            addVetToPanel(vet);
        }
    }
}

function removeVetFromSlot(slotId) {
    const slot = document.getElementById(slotId);
    const vetId = slot.dataset.vetId;
    if (vetId) {
        const vet = veterinarians.find(v => v.userId == vetId);
        addVetToPanel(vet);
        slot.classList.remove("slot-filled");
        slot.innerHTML = "";
        delete slot.dataset.vetId;

        const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
        delete schedule[slot.id];
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }
}

async function generateSchedule() {
    const schedule = JSON.parse(localStorage.getItem("schedule"));
    console.log("Generating schedule for the database:", schedule);

    if (schedule && Object.keys(schedule).length > 0) {
        const requests = [];

        for (const [slotId, vetId] of Object.entries(schedule)) {
            const date = getDateForSlot(slotId);

            const request = fetch(`http://localhost:8080/rest/schedule/assign?clinicStaffId=${vetId}&date=${date}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            requests.push(request);
        }

        try {
            const responses = await Promise.all(requests);

            const results = await Promise.all(responses.map(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                return response.json();
            }));

            console.log("Schedules generated:", results);

            Swal.fire({
                icon: 'success',
                title: 'Schedule Generated',
                text: 'The schedule has been successfully generated and saved.'
            });

            resetSchedule();
            localStorage.removeItem("schedule");
        } catch (error) {
            console.error("Error generating schedules:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to generate the schedule: ${error.message}`
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'No Schedules',
            text: 'There are no schedules to generate.'
        });
    }
}

function resetSchedule() {
    document.querySelectorAll(".schedule-cell").forEach(cell => {
        cell.classList.remove("slot-filled");
        cell.innerHTML = "";
        delete cell.dataset.vetId;
    });

    const dateInput = document.getElementById("monday-picker");
    dateInput.value = "";

    vetList.innerHTML = "";
    veterinarians.forEach(addVetToPanel);
}



// Función para actualizar el horario
function updateSchedule() {
    const dateInput = document.getElementById("monday-picker");
    const today = new Date();

    // Calcular el próximo lunes a partir de hoy
    let nextMonday = new Date(today);
    const dayOfWeek = today.getDay();
    // Ajustar para encontrar el lunes siguiente
    nextMonday.setDate(today.getDate() + (8 - dayOfWeek) % 7);

    // Establecer el mínimo de la fecha como el próximo lunes
    dateInput.min = nextMonday.toISOString().split('T')[0];

    // Validar que la fecha seleccionada no sea una fecha pasada
    dateInput.oninput = function () {
        const inputDate = new Date(this.value);

        // Verificar si la fecha seleccionada es válida y no es pasada
        if (isNaN(inputDate.getTime()) || inputDate < nextMonday) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'You cannot select a past date! Please select a valid Monday.'
            });
            this.setCustomValidity("You cannot select a past date."); // Mensaje de validación
            this.reportValidity();
            this.value = ''; // Limpiar el campo si se selecciona una fecha pasada
        } else if (inputDate.getDay() !== 0) { // Verificar si el día no es lunes
            Swal.fire({
                icon: 'error',
                title: 'Invalid Day',
                text: 'Please select a Monday.'
            });
            this.setCustomValidity("Please select a Monday."); // Mensaje de validación
            this.reportValidity();
            this.value = ''; // Limpiar el campo si no es un lunes
        } else {
            this.setCustomValidity(""); // Restablecer validez
        }
    };

    console.log(`Schedule will start on: ${nextMonday}`);
}



function getDateForSlot(slotId) {
    const dateInput = document.getElementById("monday-picker");
    const mondayDate = new Date(dateInput.value);

    mondayDate.setMinutes(mondayDate.getMinutes() + mondayDate.getTimezoneOffset());

    const slotDate = new Date(mondayDate);

    const daysAfterMonday = {
        'mon': 0,
        'tue': 1,
        'wed': 2,
        'thu': 3,
        'fri': 4,
        'sat': 5,
    };

    slotDate.setDate(slotDate.getDate() + daysAfterMonday[slotId]);

    return formatDate(slotDate);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.querySelectorAll(".schedule-cell").forEach(cell => {
    cell.addEventListener("drop", drop);
    cell.addEventListener("dragover", allowDrop);
});

document.addEventListener("DOMContentLoaded", function() {
        flatpickr("#monday-picker", {
            locale: "en",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr, instance) {
                updateSchedule();
            }
        });
    });
