await updateNavigation();

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