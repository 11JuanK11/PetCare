document.addEventListener('DOMContentLoaded', async () => {
    const selectedScheduleId = localStorage.getItem('selectedScheduleId');

    if (selectedScheduleId) {
        try {
            const response = await fetch(`/rest/weeklyschedule/${selectedScheduleId}`);
            if (!response.ok) {
                throw new Error('Error fetching weekly schedule');
            }

            const data = await response.json();
            populateSchedule(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

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


function populateSchedule(data) {
    const startDate = data.startDate;
    document.getElementById('schedule-title').textContent = `Edit Weekly Schedule for ${startDate}`;

    const schedules = data.schedules;
    schedules.forEach(async (schedule) => {
        const scheduleId = schedule.id;
        const clinicStaffId = schedule.clinicStaffId;
        const clinicStaffName = schedule.clinicStaffName;
        const clinicStaffLastName = schedule.clinicStaffLastName;

        console.log(`Schedule ID: ${scheduleId}`);
        console.log(`Clinic Staff ID: ${clinicStaffId}`);
        console.log(`Clinic Staff Name: ${clinicStaffName} ${clinicStaffLastName}`);

        const dayOfWeek = new Date(schedule.date).getDay();
        const dayId = getDayId(dayOfWeek);
        const cell = document.getElementById(dayId);

        if (cell) {
            cell.innerHTML += `
                <div draggable="true" ondragstart="drag(event)" id="schedule-${scheduleId}">
                    ${clinicStaffName} ${clinicStaffLastName} (ID: ${clinicStaffId})
                    <button onclick="removeVetFromSlot('${dayId}', '${scheduleId}', '${clinicStaffId}')" class="btn btn-danger btn-sm ms-2">x</button>
                </div>`;
        } else {
            console.error(`No se encontró el elemento para el día: ${dayId}`);
        }
    });
}

function getDayId(day) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[day];
}

function removeVetFromSlot(dayId, scheduleId, clinicStaffId) {
    const cell = document.getElementById(dayId);
    const vetDiv = document.getElementById(`schedule-${scheduleId}`);

    if (vetDiv) {
        // Obtener el ID del veterinario desde el div del horario
        const vetId = clinicStaffId;

        // Buscar el veterinario en la lista existente
        const vet = veterinarians.find(v => v.userId == vetId);
        if (vet) {
            // Añadir de nuevo el veterinario al panel lateral
            addVetToPanel(vet);
        }

        // Limpiar el contenido de la celda y eliminar el veterinario de ella
        cell.removeChild(vetDiv);
        cell.classList.remove("slot-filled"); // Eliminar clase que indica que está lleno
        cell.innerHTML = ""; // Limpiar el contenido de la celda
        delete cell.dataset.vetId; // Eliminar el ID del veterinario de la celda

        // Actualizar el localStorage
        const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
        delete schedule[dayId]; // Eliminar el horario del día específico
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }
}


function addVetToPanel(vet) {
    const vetList = document.getElementById("vet-list");
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
        event.dataTransfer.setData("text/plain", vet.userId);
        setTimeout(() => vetCard.classList.add("dragging"), 0);
    };

    vetCard.ondragend = () => {
        vetCard.classList.remove("dragging");
    };

    vetList.appendChild(vetCard);
}
