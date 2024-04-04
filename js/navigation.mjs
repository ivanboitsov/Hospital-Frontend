document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const doctorControls = document.getElementById("doctorControls");
    const authorizeButton = document.getElementById("authorizeButton");

    authorizeButton.style.display = 'none';
    doctorControls.style.display = 'none';

    loginLink.addEventListener('click', function() {
        window.location.href = 'http://localhost/login/';
    });
});
