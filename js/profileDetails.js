document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.querySelector(".form");

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
            if (response.status == 401) {
                window.location.href = '/login/';
            }
            throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(doctorData => {
         // Получение имени докотора
         const doctorNameButton = document.querySelector("#doctorControls .btn.dropdown-toggle");
         doctorNameButton.textContent = doctorData.name;
        // Заполнение полей формы значениями из полученных данных
        fillForm(doctorData);
       
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });

    function fillForm(doctorData) {
        // Заполняем поля формы значениями из doctorData
        document.getElementById("doctorInputName1").value = doctorData.name;
        document.getElementById("doctorInputGender1").value = doctorData.gender;
        document.getElementById("doctorInputBirthDate1").value = doctorData.birthday.split('T')[0];
        document.getElementById("doctorInputPhone1").value = doctorData.phone;
        document.getElementById("doctorInputEmail1").value = doctorData.email;
    }

    profileForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("doctorInputName1").value;
        const gender = document.getElementById("doctorInputGender1").value;
        const birthDate = document.getElementById("doctorInputBirthDate1").value;
        const phone = document.getElementById("doctorInputPhone1").value;
        const email = document.getElementById("doctorInputEmail1").value;

        fetch(`https://mis-api.kreosoft.space/api/doctor/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                name: name,
                birthday: birthDate,
                gender: gender,
                phone: phone,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
            }

            // Проверяем, есть ли тело ответа
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                // Если есть тело ответа и оно в формате JSON, разбираем его
                return response.json();
            } else {
                // Если тела ответа нет или оно не в формате JSON, возвращаем пустой объект
                return {};
            }
        })
        .then(data => {
            // Обработка успешного обновления профиля
            console.log('Профиль успешно обновлен:', data);
            // Получение имени докотора
            const doctorNameButton = document.querySelector("#doctorControls .btn.dropdown-toggle");
            doctorNameButton.textContent = data.name;

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