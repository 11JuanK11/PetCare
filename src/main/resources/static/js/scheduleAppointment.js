document.addEventListener("DOMContentLoaded", function() {
    const veterinarianSelect = document.getElementById("veterinarianSelect");
    const dateSelect = document.getElementById("dateSelect");
    const appointmentsContainer = document.querySelector(".appointments .row");

    fetch("http://localhost:8080/rest/clinic-staff/")
        .then(response => response.json())
        .then(veterinarians => {
            veterinarians.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.userId;
                option.textContent = `${vet.name} ${vet.lastname}`;
                veterinarianSelect.appendChild(option);
            });
        });

    veterinarianSelect.addEventListener("change", loadAppointments);

    dateSelect.addEventListener("change", loadAppointments);

    function loadAppointments() {
        const vetId = veterinarianSelect.value;
        const date = dateSelect.value;

        if (vetId && date) {
            fetch(`/rest/appointment/appointments/available?clinicStaffId=${vetId}&date=${date}`)
                .then(response => response.json())
                .then(appointments => {
                    appointmentsContainer.innerHTML = "";

                    appointments.forEach(appointment => {
                        const appointmentCard = document.createElement("div");
                        appointmentCard.className = "col-12 col-md-6 mb-3 d-flex justify-content-between align-items-center";

                        const appointmentButton = document.createElement("button");
                        appointmentButton.className = "btn btn-block";
                        const formattedStartTime = appointment.startTime.substring(0, 5);
                        const formattedEndTime = appointment.endTime.substring(0, 5);
                        appointmentButton.textContent = `${formattedStartTime} - ${formattedEndTime}`;
                        appointmentButton.classList.add(appointment.available ? "btn-primary" : "btn-secondary");
                        appointmentButton.disabled = !appointment.available;

                        const assignButton = document.createElement("button");
                        assignButton.className = "btn btn-outline-primary";
                        assignButton.textContent = "Assign appointment";
                        assignButton.onclick = () => assignAppointment(appointment.id);

                        appointmentCard.appendChild(appointmentButton);
                        appointmentCard.appendChild(assignButton);
                        appointmentsContainer.appendChild(appointmentCard);
                    });
                });
        }
    }

    function assignAppointment(appointmentId) {
        alert(`Cita asignada: ${appointmentId}`);
    }
});

flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
    minDate: "today",
});