let queryParams = new URLSearchParams();

queryParams = await get_params();

const patients_data = await get_patients(queryParams);
const patient_sample = await get_patient_sample();

await set_pagination(patients_data.pagination);
console.log(patients_data.patients);

const searchButton = document.getElementById('searchButton');

await generate_patients(patients_data.patients);

// Отработка после нажатия на кнопку поиска
searchButton.addEventListener('click', function () {

    // Получаем значения из фильтров и сортировок
    const patientName = document.getElementById('patientSearchName1').value;
    const conclusions = document.getElementById('patientConclusionSelect1').value;
    const scheduledVisits = document.getElementById('scheduledVisitsCheckbox').checked;
    const onlyMine = document.getElementById('onlyMineCheckbox').checked;
    const sorting = document.getElementById('patientSortSelect1').value;
    const size = document.getElementById('patientPageCountSelect1').value;

    if(queryParams.has("name")){
        if (patientName != '') {
            queryParams.set("name", patientName);
            if (patientName != queryParams.get("name")){
                queryParams.set("page", 1);
            }
        }
        else {
            queryParams.delete('name');
            queryParams.set("page", 1);
        }
    }
    else {
        if (patientName != '') {
            queryParams.append('name', patientName);
            queryParams.set("page", 1);
        }
    }
    if(queryParams.has("conclusions")){
        if (conclusions != '') {
            queryParams.set("conclusions", conclusions);
            if (conclusions != queryParams.get("conclusions")){
                queryParams.set("page", 1);
            }
        }
        else {
            queryParams.delete('conclusions');
            queryParams.set("page", 1);
        }
    }
    else {
        if (conclusions != '') {
            queryParams.append('conclusions', conclusions);
            queryParams.set("page", 1);
        }
    }
    if(queryParams.has("sorting")){
        queryParams.set("sorting", sorting);
        if (sorting != queryParams.get("sorting")){
            queryParams.set("page", 1);
        }
    }
    else {
        queryParams.append('sorting', sorting);
        queryParams.set("page", 1);
    }
    if(queryParams.has("scheduledVisits")){
        queryParams.set("scheduledVisits", scheduledVisits);
        if (scheduledVisits != queryParams.get("scheduledVisits")){
            queryParams.set("page", 1);
        }
    }
    else {
        queryParams.append('scheduledVisits', scheduledVisits);
        queryParams.set("page", 1);
    }
    if(queryParams.has("onlyMine")){
        queryParams.set("onlyMine", onlyMine);
        if (onlyMine != queryParams.get("onlyMine")){
            queryParams.set("page", 1);
        }
    }
    else {
        queryParams.append('onlyMine', onlyMine);
        queryParams.set("page", 1);
    }
    if(queryParams.has("size")){
        queryParams.set("size", size);
        if (size != queryParams.get("size")){
            queryParams.set("page", 1);
        }
    }
    else {
        queryParams.append('size', size);
        queryParams.set("page", 1);
    }

    window.location.href = `/patients/?${queryParams.toString()}`;
});

// Отработка нажатия на конкретного пациента
document.addEventListener('mousedown', async function(event) {
    let element = event.target;

    if (element.classList.contains('pagination-button')) {
        let pagination_param = element.innerText;
        let going = true;
        if (pagination_param == '<') {
            queryParams.set('page', 1);
        }
        else if (pagination_param == '>'){
            let last_page = patients_data.pagination.count;
            queryParams.set('page', last_page);
        }
        else {
            if (pagination_param == patients_data.pagination.current){
                going = false;
            }
            queryParams.set('page', pagination_param);
        }
        if (going) {
            window.location.href = `/patients/?${queryParams.toString()}`;
        }
        
    }
    
    else if (element.classList.contains('go_to_patient')) {
        let patient_id = '';
        if (!element.classList.contains('go_to_patient_child') && !element.classList.contains('go_to_patient_double_child')) {
            patient_id = element.getAttribute('id').split('_')[1];
        }
        else if (element.classList.contains('go_to_patient_child')) {
            patient_id = element.parentElement.getAttribute('id').split('_')[1];
        }
        else if (element.classList.contains('go_to_patient_double_child')) {
            patient_id = element.parentElement.parentElement.getAttribute('id').split('_')[1];
        }
        window.location.href = `/patient/${patient_id}`;
    }
});

// Функция установки параметров в адрес страницы
async function get_params() {
    let urlParams = new URLSearchParams(window.location.search);
    let patientName = document.getElementById('patientSearchName1');
    let conclusions = document.getElementById('patientConclusionSelect1');
    let scheduledVisits = document.getElementById('scheduledVisitsCheckbox');
    let onlyMine = document.getElementById('onlyMineCheckbox');
    let sorting = document.getElementById('patientSortSelect1');
    let size = document.getElementById('patientPageCountSelect1');

    if (urlParams.has("name")){
        patientName.value = urlParams.get("name");
    }
    if (urlParams.has("size")){
        size.value = urlParams.get("size");
    }
    if (urlParams.has("conclusions")){
        conclusions.value = urlParams.get("conclusions");
    }
    if (urlParams.has("sorting")){
        sorting.value = urlParams.get("sorting");
    }
    if (urlParams.has("scheduledVisits")){
        if (urlParams.get("scheduledVisits").toString() == 'true') {
            scheduledVisits.checked = true;
        }
    }
    if (urlParams.has("onlyMine")){
        if (urlParams.get("onlyMine").toString() == 'true') {
            onlyMine.checked = true;
        }
    }

    // Дефолтные значения
    if(!urlParams.has("page")) {
        urlParams.append("page", 1);
    }
    
    if(!urlParams.has("size")) {
        urlParams.append("size", 5);
        size.value = 5;
    }
    else {
        size.value = urlParams.get('size')
    }
    if(!urlParams.has("scheduledVisits")) {
        urlParams.append("scheduledVisits", false);
    }
    if(!urlParams.has("onlyMine")) {
        urlParams.append("onlyMine", false);
    }

    return urlParams;
}

// Генерация пациент боксов
async function generate_patients(patients) {
    for (let i = 0; i < patients.length; i++) {
        const patient = patients[i];
        let new_patient = patient_sample.cloneNode(true);

        new_patient.querySelector('#patientName').innerText = patient.name;
        new_patient.querySelector('#patientBirthDate').innerText = await parse_date_birthday(patient.birthday);
        new_patient.querySelector('#patientGender').innerText = await parse_gender(patient.gender);

        new_patient.setAttribute('id', `patientObject_${patient.id}`);
        document.getElementById('patients_box').appendChild(new_patient);
    }
}

// Функция для работы пагинации
async function set_pagination(pagination) {
    let maxPage = pagination.count;
    let currentPage = pagination.current;

    let start_pagination = Math.max(currentPage - 2 - Math.max(currentPage + 2 - maxPage, 0), 1);
    let paginatinObject = document.getElementById("pagination_main");
    let k = 1;

    for (let i = start_pagination; i < Math.min(maxPage + 2, start_pagination + 5); i++) {
        paginatinObject.children[k].children[0].innerText = i;
        paginatinObject.children[k].style.display = '';
        k += 1;
    }
        
    if (start_pagination > 1) {
        paginatinObject.children[0].style.display = '';
    }
    if (Math.min(maxPage, start_pagination + 5) < maxPage) {
        paginatinObject.children[6].style.display = '';
    }
}

// Парсинг даты рождения
async function parse_date_birthday(date) {
    if (date != null) {
        let new_d = date.toString().split('T')[0].split('-');
        let days = new_d[2];
        let month = new_d[1];
        let year = new_d[0];
        return `${days}.${month}.${year}`;
    }
    return "";
}

// Парсинг гендера
async function parse_gender(gender) {
    if (gender == "Male") {
        return 'Мужчина';
    }
    return 'Женщина';
}

// Получение пациентов с сервера по заданым параметрам
async function get_patients(params) {
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/patient?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            if (response.status == 401) {
                window.location.href = '/login/';
            }
            throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();

        return data;
    
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// Получение с сервера шаблона боксов для пациентов
async function get_patient_sample() {
    return fetch('http://localhost/template/patient_sample.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.text();
    })
    .then(htmlTemplate => {
        const parser = new DOMParser();
        let patientTemplate = parser.parseFromString(htmlTemplate, 'text/html');
        return patientTemplate.getElementsByTagName('div')[0];
    })
    .catch(error => {
        console.error('Error fetching and inserting post template:', error);
    });
}