document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.querySelector("form");
    const registerButton = document.getElementById("registerButton");
    const loginLink = document.getElementById('loginLink');
    const doctorControls = document.getElementById("doctorControls");
    const authorizeButton = document.getElementById("authorizeButton");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("exampleInputEmail1").value;
        const password = document.getElementById("exampleInputPassword1").value;

        fetch('https://mis-api.kreosoft.space/api/doctor/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
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

            updateNavigation();

            Swal.fire({
                title: 'Успешно',
                icon: 'success',
                confirmButtonText: 'ОК',
                didClose: () => {
                    // Перенаправление на страницу профиля
                    window.location.href = 'http://localhost/profile/';
                }
            })
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            // Вывод сообщения об ошибке на странице
            document.getElementById('error-message').innerText = 'Ошибка при авторизации. Пожалуйста, проверьте введенные данные и повторите попытку.';
        });
    });

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

            loginLink.style.display = 'none';
            authorizeButton.style.display = 'block';
            doctorControls.style.display = 'block';
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
    }

    registerButton.addEventListener("click", function(){
        window.location.href = 'http://localhost/registration/';
    });
});
