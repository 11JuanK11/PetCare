function togglePasswordVisibility() {
    const passwordInput = document.getElementById("floatingPassword");
    const passwordIcon = document.getElementById("togglePasswordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
    }
}

function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById("floatingConfirmPassword");
    const confirmPasswordIcon = document.getElementById("toggleConfirmPasswordIcon");

    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        confirmPasswordIcon.classList.remove("fa-eye");
        confirmPasswordIcon.classList.add("fa-eye-slash");
    } else {
        confirmPasswordInput.type = "password";
        confirmPasswordIcon.classList.remove("fa-eye-slash");
        confirmPasswordIcon.classList.add("fa-eye");
    }
}

function validatePasswordMatch() {
    const password = document.getElementById("floatingPassword").value;
    const confirmPassword = document.getElementById("floatingConfirmPassword").value;
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    if (password !== confirmPassword) {
        confirmPasswordError.style.display = "block";
        return false;
    }

    confirmPasswordError.style.display = "none";
    return true;
}

function validatePassword() {
    const password = document.getElementById("floatingPassword").value;
    const username = document.getElementById("floatingUsername").value;
    const passwordError = document.getElementById("passwordError");

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        passwordError.style.display = "block";
        passwordError.textContent = "Password must be at least 8 characters, with letters, numbers, and special characters.";
        return false;
    }

    if (username === password) {
        passwordError.style.display = "block";
        passwordError.textContent = "Username cannot be the same as the password.";
        return false;
    }

    passwordError.style.display = "none";
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('clientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!validatePasswordMatch() || !validatePassword()) {
        return;
    }

    const formData = {
        userId: document.getElementById('floatingIdNumber').value,
        name: document.getElementById('floatingName').value,
        lastname: document.getElementById('floatingLastname').value,
        phoneNumber: document.getElementById('floatingPhoneNumber').value,
        username: document.getElementById('floatingUsername').value,
        password: document.getElementById('floatingPassword').value
    };

    try {
        const response = await fetch('http://localhost:8080/rest/client/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.status === 500) {
            throw new Error('Existing user');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Success:', data);
        Swal.fire('Success', 'Created user.', 'success');
        
        await sleep(2000); // Pausa de 2 segundos antes de redirigir
        window.location.href = "http://localhost:8080/public/login";
        
    } catch (error) {
        if (error.message === 'Existing user') {
            Swal.fire('Error', 'Existing user.', 'error');
        } else {
            console.error('Error submitting the form:', error);
        }
    }
});
