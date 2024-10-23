    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#userPassword');
    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const passwordConfirmInput = document.querySelector('#ConfirmPassword');

    togglePassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the icon based on the type
        if (type === 'text') {
            this.classList.remove('bi-eye');
            this.classList.add('bi-eye-slash');
        } else {
            this.classList.remove('bi-eye-slash');
            this.classList.add('bi-eye');
        }
    });

    toggleConfirmPassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = passwordConfirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordConfirmInput.setAttribute('type', type);

        // Toggle the icon based on the type
        if (type === 'text') {
            this.classList.remove('bi-eye');
            this.classList.add('bi-eye-slash');
        } else {
            this.classList.remove('bi-eye-slash');
            this.classList.add('bi-eye');
        }
    });