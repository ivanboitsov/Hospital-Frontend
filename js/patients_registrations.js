document.addEventListener("DOMContentLoaded", function () {

    const registrationButton = document.getElementById("registerNewPatientButton");
    const registrationModal = document.getElementById("registrationModal");

    updateNavigation();

    function updateNavigation(){
        // Получение данных доктора с сервера
        fetch('https://mis-api.kreosoft.space/api/doctor/profile', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(doctorData => {
            // Получение имени докотора
            const doctorNameButton = document.querySelector("#doctorControls .btn.dropdown-toggle");
            doctorNameButton.textContent = doctorData.name;
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
    }

    // Открытие модального окна при клике на кнопку "Регистрация нового пациента"
    registrationButton.addEventListener('click', function(){
        registrationModal.style.display = "block";
    });

    // Закрытие модального окна при клике вне его области
    window.addEventListener("click", function (event) {
        if (event.target === registrationModal) {
            registrationModal.style.display = "none";
        }
    });

    registrationModal.addEventListener("submit", function(event) {
        event.preventDefault();

        const patientName = document.getElementById("patientExampleInputName1").value;
        const patientGender = document.getElementById("patientExampleInputGender1").value;
        const patientBirthDate = document.getElementById("patientExampleInputBirthDate1").value;

        fetch('https://mis-api.kreosoft.space/api/patient', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: patientName,
                birthday: patientBirthDate,
                gender: patientGender,
            })  
        })
        .then(response => {
            if (!response.ok){
                throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(patientData => {
            console.log(`Пациент успешно зарегестрирован`);
            Swal.fire({
                title: 'Успешно',
                icon: 'success',
                text: `Пациент успешно зарегестрирован!` ,
                confirmButtonText: 'ОК',
                didClose: () => {
                    // Перенаправление на главную страницу
                    window.location.href = 'http://localhost/patients/';
                }
            })
        })
        .catch(error => {
            console.error(`Fetch Error:`, error);
        });
    });

});