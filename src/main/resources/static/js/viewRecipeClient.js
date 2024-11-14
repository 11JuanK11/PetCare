document.addEventListener("DOMContentLoaded", () => {
    loadPets();
});

function loadPets(){
    const userIdElement = document.querySelector("#userId span");
    const userId = userIdElement ? userIdElement.textContent.trim() : null;
    const petSelect = document.getElementById("petSelect");

    if (userId) {
        sessionStorage.setItem("userId", userId);
    }

    if (userId) {
        fetch(`http://localhost:8080/rest/client/pets/${userId}`)
            .then(response => response.json())
            .then(pets => {
                pets.forEach(pet => {
                    const option = document.createElement("option");
                    option.value = pet.id;
                    option.textContent = `${pet.name} ${pet.lastname}`;
                    petSelect.appendChild(option);
                });
            })
            .catch(error => console.error("Error fetching pets:", error));
    } else {
        console.error("User ID not found");
    }
}