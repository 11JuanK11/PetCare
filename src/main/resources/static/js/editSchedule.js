let veterinarians = [];

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

            await loadVeterinarians(data);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        await loadVeterinarians();
    }
});

// Función para permitir el evento de arrastre
function allowDrop(event) {
    event.preventDefault();
}

async function loadVeterinarians(scheduleData = { schedules: [] }) {
    try {
        const response = await fetch("http://localhost:8080/rest/clinic-staff/");
        if (!response.ok) {
            throw new Error("Error fetching veterinarians");
        }

        veterinarians = await response.json();

        const scheduledVetIds = new Set((scheduleData.schedules || []).map(schedule => schedule.clinicStaffId));
        veterinarians.filter(vet => !scheduledVetIds.has(vet.userId)).forEach(addVetToPanel);
    } catch (error) {
        console.error("Error loading veterinarians:", error);
    }
}

function populateSchedule(data) {
    const startDate = data.startDate;
    document.getElementById('schedule-title').textContent = `Edit Weekly Schedule for ${startDate}`;

    const schedules = data.schedules;
    schedules.forEach(schedule => {
        const clinicStaffId = schedule.clinicStaffId;
        const clinicStaffName = schedule.clinicStaffName;
        const clinicStaffLastName = schedule.clinicStaffLastName;

        const dayOfWeek = new Date(schedule.date).getDay();
        const dayId = getDayId(dayOfWeek);
        const cell = document.getElementById(dayId);

        if (cell) {
            cell.innerHTML = `
                ${clinicStaffName} ${clinicStaffLastName} (ID: ${clinicStaffId})
                <button onclick="removeVetFromSlot('${dayId}', '${clinicStaffId}')" class="btn btn-danger btn-sm ms-2">x</button>`;
            cell.classList.add("slot-filled");
            cell.dataset.vetId = clinicStaffId;
        } else {
            console.error(`No se encontró el elemento para el día: ${dayId}`);
        }
    });
}

function removeVetFromSlot(dayId, clinicStaffId) {
    const cell = document.getElementById(dayId);
    if (cell) {
        const vet = veterinarians.find(v => v.userId == clinicStaffId);
        if (vet) {
            addVetToPanel(vet);
        }
        cell.innerHTML = "";
        cell.classList.remove("slot-filled");
        delete cell.dataset.vetId;

        const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
        delete schedule[dayId];
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }
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
            slot.innerHTML = `${vet.name} ${vet.lastname}<br>ID: ${vet.userId} <button onclick="removeVetFromSlot('${slot.id}', '${vet.userId}')" class="btn btn-danger btn-sm ms-2">x</button>`;
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

function addVetToPanel(vet) {
    if (document.querySelector(`.vet-card[data-id='${vet.userId}']`)) return;

    const vetList = document.getElementById("vet-list");
    const vetCard = document.createElement("div");
    vetCard.className = "card vet-card";
    vetCard.draggable = true;
    vetCard.dataset.id = vet.userId;

    vetCard.innerHTML = `
        <div class="card-body">
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

function getDayId(day) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[day];
}

async function deleteCurrentWeeklySchedule() {
    const selectedScheduleId = localStorage.getItem("selectedScheduleId");

    if (!selectedScheduleId) {
        console.error("No selected schedule ID found in localStorage.");
        return;
    }

    try {
        const response = await fetch(`/rest/weeklyschedule/${selectedScheduleId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete the weekly schedule.");
        }

        console.log("Weekly schedule deleted successfully.");
        localStorage.removeItem("selectedScheduleId"); // Clear localStorage ID after deletion

    } catch (error) {
        console.error("Error deleting weekly schedule:", error);
    }
}

async function saveScheduleChanges() {
    await deleteCurrentWeeklySchedule(); // Step 1: Delete the existing schedule

    const startDate = document.getElementById('schedule-title').textContent.match(/\d{4}-\d{2}-\d{2}/)[0];
    const scheduleData = JSON.parse(localStorage.getItem("schedule")) || {};
    const newSchedules = Object.entries(scheduleData).map(([dayId, vetId]) => ({
        date: getDateFromDayId(dayId, startDate),
        clinicStaffId: vetId
    }));

    try {
        const response = await fetch(`/rest/weeklyschedule/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                startDate: startDate,
                schedules: newSchedules
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create a new weekly schedule.");
        }

        const createdSchedule = await response.json();
        console.log("New weekly schedule created:", createdSchedule);

        localStorage.setItem("selectedScheduleId", createdSchedule.id);

    } catch (error) {
        console.error("Error saving new weekly schedule:", error);
    }
}

function getDateFromDayId(dayId, startDate) {
    const daysOffset = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5 };
    const offset = daysOffset[dayId];
    const baseDate = new Date(startDate);
    baseDate.setDate(baseDate.getDate() + offset);
    return baseDate.toISOString().split("T")[0];
}
