document.getElementById('loginLink').addEventListener('click', function() {
    window.location.href = `/login/`;
});

document.getElementById("profileButton").addEventListener('click', function() {
    window.location.href = `/profile/`;
});

document.getElementById("patientsButton").addEventListener('mousedown', function() {
    window.location.href = `/patients/`;
});

document.getElementById("consultationButton").addEventListener('mousedown', function() {
    window.location.href = `/consultation/`;
});

document.getElementById("reportButton").addEventListener('mousedown', function() {
    window.location.href = `/reports/`;
});