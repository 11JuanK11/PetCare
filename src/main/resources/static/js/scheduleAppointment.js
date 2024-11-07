document.addEventListener("DOMContentLoaded", function() {
    const veterinarianSelect = document.getElementById("veterinarianSelect");
    const dateSelect = document.getElementById("dateSelect");
    const appointmentsContainer = document.querySelector(".appointments .row");
    const messageContainer = document.createElement("div");
    messageContainer.style.backgroundColor = "#f8d7da";
    messageContainer.style.color = "#721c24";
    messageContainer.style.border = "1px solid #f5c6cb";
    messageContainer.style.borderRadius = "5px";
    messageContainer.style.padding = "10px";
    messageContainer.style.marginBottom = "10px";
    messageContainer.style.display = "none";
    appointmentsContainer.parentNode.insertBefore(messageContainer, appointmentsContainer);
    let veterinarians = [];

    fetch("http://localhost:8080/rest/clinic-staff/")
        .then(response => response.json())
        .then(data => {
            veterinarians = data;
            loadAvailableVeterinarians();
        });

    veterinarianSelect.addEventListener("change", loadAppointments);
    dateSelect.addEventListener("change", loadAvailableVeterinarians);

    function loadAvailableVeterinarians() {
        const date = dateSelect.value;
        veterinarianSelect.innerHTML = "";
        messageContainer.innerHTML = "";

        if (date) {
            Promise.all(veterinarians.map(vet =>
                fetch(`/rest/appointment/appointments/available?clinicStaffId=${vet.userId}&date=${date}`)
                    .then(response => response.json())
                    .then(appointments => {
                        if (appointments.length > 0) {
                            const option = document.createElement("option");
                            option.value = vet.userId;
                            option.textContent = `${vet.name} ${vet.lastname}`;
                            veterinarianSelect.appendChild(option);
                        }
                    })
            )).then(() => {
                if (veterinarianSelect.innerHTML === "") {
                    messageContainer.innerHTML = "<p>No veterinarians available for this date.</p>";
                    messageContainer.style.display = "block";
                    appointmentsContainer.innerHTML = "";
                } else {
                    messageContainer.style.display = "none";
                    loadAppointments();
                }
            });
        } else {
            veterinarians.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.userId;
                option.textContent = `${vet.name} ${vet.lastname}`;
                veterinarianSelect.appendChild(option);
            });
            messageContainer.style.display = "none";
        }
    }

    function loadAppointments() {
        const vetId = veterinarianSelect.value;
        const date = dateSelect.value;

        if (vetId && date) {
            fetch(`/rest/appointment/appointments/available?clinicStaffId=${vetId}&date=${date}`)
                .then(response => response.json())
                .then(appointments => {
                    appointmentsContainer.innerHTML = "";
                    messageContainer.innerHTML = "";


                    const limitedAppointments = appointments.slice(0, 26);//-----------------------------

                    if (limitedAppointments.length === 0) {//-----------------------------
                        messageContainer.innerHTML = "<p>No appointments available for this veterinarian on this date.</p>";
                        messageContainer.style.display = "block";
                    } else {
                        messageContainer.style.display = "none";
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

                            if (!appointment.available) {
                                timeCell.style.backgroundColor = "#f8d7da";
                                timeCell.style.color = "#721c24";
                                actionCell.style.backgroundColor = "#f8d7da";
                                assignButton.disabled = true;
                                assignButton.textContent = "Not available";
                            } else {
                                assignButton.onclick = () => assignAppointment(appointment.id);
                            }
                            actionCell.appendChild(assignButton);
                            row.appendChild(actionCell);

                            tbody.appendChild(row);
                        });
                        table.appendChild(tbody);
                        appointmentsContainer.appendChild(table);
                    }
                });
        }
    }

    function assignAppointment(appointmentId) {
        alert("Appointment assigned");
    }
});

flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
    minDate: "today",
});
