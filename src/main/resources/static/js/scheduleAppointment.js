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

                    const table = document.createElement("table");
                    table.className = "table table-striped";

                    const thead = document.createElement("thead");
                    const headerRow = document.createElement("tr");
                    const timeHeader = document.createElement("th");
                    timeHeader.textContent = "Time";
                    headerRow.appendChild(timeHeader);
                    const actionHeader = document.createElement("th");
                    actionHeader.textContent = "Action";
                    headerRow.appendChild(actionHeader);
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    const tbody = document.createElement("tbody");
                    appointments.forEach(appointment => {
                        const row = document.createElement("tr");
                        const formattedStartTime = appointment.startTime.substring(0, 5);
                        const formattedEndTime = appointment.endTime.substring(0, 5);

                        const timeCell = document.createElement("td");
                        timeCell.textContent = `${formattedStartTime} - ${formattedEndTime}`;
                        timeCell.style.color = "#555";
                        row.appendChild(timeCell);

                        const actionCell = document.createElement("td");
                        const assignButton = document.createElement("button");
                        assignButton.className = "btn";
                        assignButton.style.backgroundColor = "#95BDFF";
                        assignButton.style.color = "#fff";
                        assignButton.textContent = "Assign appointment";

                        assignButton.style.transition = "background-color 0.3s";
                        assignButton.onmouseover = () => {
                            assignButton.style.backgroundColor = "#7DA8E1";
                        };
                        assignButton.onmouseout = () => {
                            assignButton.style.backgroundColor = "#95BDFF";
                        };

                        assignButton.onclick = () => assignAppointment(appointment.id);
                        actionCell.appendChild(assignButton);
                        row.appendChild(actionCell);

                        tbody.appendChild(row);
                    });
                    table.appendChild(tbody);
                    appointmentsContainer.appendChild(table);
                });
        }
    }

    function assignAppointment(appointmentId) {
        alert(`Cita asignada`);
    }
});

flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
    minDate: "today",
});
