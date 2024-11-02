
    async function fetchPets() {
        try {
            const response = await fetch('/rest/pets/');
            const pets = await response.json();
            const tableBody = document.getElementById('petTableBody');
            pets.forEach(pet => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pet.id}</td>
                    <td>${pet.name}</td>
                    <td>${pet.age}</td>
                    <td>${pet.race}</td>
                    <td>${pet.weight}</td>
                    <td>
                        <a href="/veterinarian-panel/pets/${pet.id}/medical-history" class="btn"  style="background-color: #95BDFF; border: none;">View Medical History</a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    }
    window.onload = fetchPets;