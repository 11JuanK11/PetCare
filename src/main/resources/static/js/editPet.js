document.addEventListener('DOMContentLoaded', () => {
    const petId = localStorage.getItem('petIdToEdit');
    console.log(petId);
    if (!petId || petId === 'null') {
        window.location.href = 'http://localhost:8080/client-panel/pets';
        return;
    }

    loadPetData(petId);

    document.getElementById('petForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        if (validateForm()) {
            updatePet(petId);
        }
    });
});

function validateForm() {
    const petName = document.getElementById('petName').value.trim();
    const petLastname = document.getElementById('petLastname').value.trim();
    const petAge = document.getElementById('petAge').value.trim();
    const petRace = document.getElementById('petRace').value.trim();
    const petWeight = document.getElementById('petWeight').value.trim();

    if (!petName || !petLastname || !petAge || !petRace || !petWeight) {
        Swal.fire({
            title: 'Warning!',
            text: 'All fields are required!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return false;
    }
    return true;
}

function loadPetData(id) {
    fetch(`http://localhost:8080/rest/pets/${id}`)
        .then(response => response.json())
        .then(pet => {
            document.getElementById('petName').value = pet.name;
            document.getElementById('petLastname').value = pet.lastname;
            document.getElementById('petAge').value = pet.age;
            document.getElementById('petRace').value = pet.race;
            document.getElementById('petWeight').value = pet.weight;
            document.getElementById('petImageDisplay').src = pet.image; 
        })
        .catch(error => console.error('Error loading pet data:', error));
}

async function updatePet(petId) {
    const userId = document.getElementById('userId').textContent.trim();

    const petData = {
        id: petId,
        name: document.getElementById('petName').value,
        lastname: document.getElementById('petLastname').value,
        age: document.getElementById('petAge').value,
        race: document.getElementById('petRace').value,
        weight: document.getElementById('petWeight').value,
        client: { userId: userId }
    };

    const result = await Swal.fire({
        title: 'Confirm Update',
        html: `
            <p><strong>Name:</strong> ${petData.name}</p>
            <p><strong>Lastname:</strong> ${petData.lastname}</p>
            <p><strong>Age:</strong> ${petData.age}</p>
            <p><strong>Race:</strong> ${petData.race}</p>
            <p><strong>Weight:</strong> ${petData.weight}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Go Back'
    });
    

    // Si el usuario elige volver, no hace nada
    if (!result.isConfirmed) {
        return;
    }

    const formData = new FormData();
    formData.append('pet', new Blob([JSON.stringify(petData)], { type: 'application/json' }));

    const imageFile = document.getElementById('petImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    } else {
        const existingImageSrc = document.getElementById('petImageDisplay').src;
        const filename = existingImageSrc.split('/').pop();
        
        try {
            const response = await fetch(`http://localhost:8080/uploads/${filename}`);
            const blob = await response.blob();
            formData.append('image', blob, filename);
        } catch (error) {
            console.error('Error fetching existing image:', error);
            Swal.fire('Error', 'Could not fetch the existing image.', 'error');
            return;
        }
    }

    fetch('http://localhost:8080/rest/pets/', {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        Swal.fire({
            title: 'Success!',
            text: 'Pet updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the pet.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}
