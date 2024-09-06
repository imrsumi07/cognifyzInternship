//Smoother Client-Side navigation to Contact
document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.getElementById('contactButton');
    const contactFooter = document.getElementById('contactFooter');

    if (contactButton) {
        contactButton.addEventListener('click', function() {
            contactFooter.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

//form validation to include more complex rules

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitButton = form.querySelector('button[type="submit"]');
    
    function checkPasswordStrength(password) {
        const strength = {
            weak: /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password),
            medium: /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
            strong: /(?=.{12,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password),
        };
        return strength.strong ? 'Strong' : strength.medium ? 'Medium' : strength.weak ? 'Weak' : 'Invalid';
    }

    function validateForm() {
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;

        let isValid = true;

        // Clear previous error messages
        form.querySelectorAll('.error').forEach(el => el.remove());

        // Check password strength
        if (checkPasswordStrength(passwordValue) === 'Invalid') {
            displayError(password, 'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.');
            isValid = false;
        }

        // Check if passwords match
        if (passwordValue !== confirmPasswordValue) {
            displayError(confirmPassword, 'Passwords do not match.');
            isValid = false;
        }

        return isValid;
    }

    function displayError(input, message) {
        const error = document.createElement('div');
        error.className = 'error text-danger';
        error.textContent = message;
        input.insertAdjacentElement('afterend', error);
    }

    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });
});
