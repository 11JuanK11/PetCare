function togglePasswordVisibility() {
    const passwordField = document.getElementById("floatingPassword");
    const passwordIcon = document.getElementById("togglePasswordIcon");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
    }
}

function validatePassword() {
    const passwordField = document.getElementById("floatingPassword");
    const errorDiv = document.getElementById("passwordError");
    const password = passwordField.value;

    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    if (!regex.test(password)) {
        errorDiv.style.display = "block";
    } else {
        errorDiv.style.display = "none";
    }
}

document.getElementById('clientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        userId: document.getElementById('floatingIdNumber').value,
        name: document.getElementById('floatingName').value,
        lastname: document.getElementById('floatingLastname').value,
        phoneNumber: document.getElementById('floatingPhoneNumber').value,
        username: document.getElementById('floatingUsername').value,
        password: document.getElementById('floatingPassword').value
    };

    fetch('http://localhost:8080/rest/client/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        window.location.href = "http://localhost:8080/login"; // Redirige a la página de inicio de sesión
    })
    .catch((error) => {
        console.error('Error submitting the form:', error);
    });
});
