document.addEventListener("DOMContentLoaded", function () {

    const logoutButton = this.getElementById('logoutButton');
    const profileButton = document.getElementById("profileButton");

    logoutButton.addEventListener('click', function () {
        
        // Получение токена из локального хранилища
        const userToken = localStorage.getItem('userToken');

        // Проверка наличия токена
        if (userToken) {
            // Отправка запроса на сервер для аннулирования токена
            fetch('https://mis-api.kreosoft.space/api/doctor/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + userToken,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Очистка токена из локального хранилища
                localStorage.removeItem('userToken');
                console.log('Успешный выход');

                Swal.fire({
                    title: 'Успешно',
                    text: 'Вы успешно вышли из аккаунта.',
                    icon: 'success',
                    confirmButtonText: 'ОК',
                    didClose: () => {
                        // Перенаправление на главную страницу
                        window.location.href = 'http://localhost/mainPage/';
                    }
                })
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
        }
    });

    profileButton.addEventListener('click', function() {
        window.location.href = 'http://localhost/profile/';
    });
});