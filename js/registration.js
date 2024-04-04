document.addEventListener('DOMContentLoaded', function () {
   
    const registrationForm = document.querySelector("form");
    const loginLink = document.getElementById('loginLink');
    const doctorControls = document.getElementById("doctorControls");
    const authorizeButton = document.getElementById("authorizeButton");

    loginLink.addEventListener('mousedown', function() {
        window.location.href = `/login/`;
    });

    registrationForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("exampleInputName1").value;
        const gender = document.getElementById("exampleInputGender1").value;
        const birthDate = document.getElementById("exampleInputBirthDate1").value;
        const phone = document.getElementById("exampleInputPhone1").value;
        const speciality = document.getElementById("exampleInputSpeciality1").value;
        const email = document.getElementById("exampleInputEmail1").value;
        const password = document.getElementById("exampleInputPassword1").value;

        fetch('https://mis-api.kreosoft.space/api/doctor/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify ({
                name: name,
                password: password,
                email: email,
                birthday: birthDate,
                gender: gender,
                phone: phone,
                speciality: speciality,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Успешный вход
            localStorage.setItem('userToken', data.token);
            // Вывод токена в консоль
            console.log(data.token);

            // Получение имени докотора
            const doctorNameButton = document.querySelector("#doctorControls .btn.dropdown-toggle");
            doctorNameButton.textContent = data.name;

            loginLink.style.display = 'none';
            authorizeButton.style.display = 'block';
            doctorControls.style.display = 'block';

            Swal.fire({
                title: 'Успешно',
                icon: 'success',
                confirmButtonText: 'ОК',
                didClose: () => {
                    // Перенаправление на главную страницу
                    window.location.href = 'http://localhost/profile/';
                }
            })
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
    });

});