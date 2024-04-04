var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.page);
let codes = [];
await get_codes();
await set_filtration_params(urlParams);


const patient_id = window.location.href.split("?")[0].split("/")[window.location.href.split("?")[0].split("/").length - 1];
console.log(patient_id);
const patient = await get_patient();
const inspections = await get_patient_ispections(urlParams);
const inspectionSample = await get_inspection_patient_sample();
console.log(inspections);

await set_patinet_profile(patient);

await generate_inspections(inspections.inspections);

await updateNavigation();

document.addEventListener('mousedown', async function(event){
    const element = event.target;
    if (element.classList.contains("child_showing")){
        const insp_id = element.getAttribute('id').split("_")[1];
        if (element.classList.contains("plus")) {
            element.style.display = 'none';
            document.getElementById(`hasNestedMinusButton_${insp_id}`).style.display = '';
            document.getElementById(`childrenInspections_${insp_id}`).style.display = '';
        }
        else if (element.classList.contains("minus")) {
            element.style.display = 'none';
            document.getElementById(`hasNestedPlusButton_${insp_id}`).style.display = '';
            document.getElementById(`childrenInspections_${insp_id}`).style.display = 'none';
        }
    }
    if (element.classList.contains("addInspetionButtonMini")){
        localStorage.setItem("patientId" , element.getAttribute("id").split("_")[1]);
        window.location.href = '/inspection/create/';
    }
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
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
}


async function get_codes() {
    await fetch('https://mis-api.kreosoft.space/api/dictionary/icd10/roots')
    .then(response => {
        // Проверяем, успешен ли запрос (код ответа 200-299)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        // Преобразуем ответ в формат JSON
        return response.json();
    })
    .then(data => {
        // Обрабатываем полученные данные
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const code = data[i];
            document.getElementById('ISD10SelectInupt').innerHTML += `<option value="${code.id}" id="code_${code.id}">${code.code}</option>`
        }
        codes = data;
    })
    .catch(error => {
        // Обрабатываем ошибки
        console.error('Fetch error:', error);
    });
}

async function generate_inspections(inspections) {
    for (let i = 0; i < inspections.length; i++) {
        const inspection = inspections[i];
        let new_inspection = inspectionSample.cloneNode(true);

        new_inspection.querySelector('#inspectionDate').innerHTML = await parse_date_birthday(inspection.date);
        
        new_inspection.querySelector('#inspectionConclusion').innerHTML = inspection.conclusion;
        new_inspection.querySelector('#inspectionDoctorOwner').innerText = inspection.doctor;

        new_inspection.setAttribute('id', `inspectionObject_${inspection.id}`);
        if (inspection.conclusion == "Death") {
            new_inspection.querySelector('#inspection_box_object').classList.add('red-box');
            new_inspection.querySelector('#addInspetionButtonMini').style.display = 'none';
        }

        if (inspection.hasNested == true) {
            new_inspection.querySelector('#addInspetionButtonMini').style.display = 'none';           
            new_inspection.querySelector('#hasNestedPlusButton').style.display = '';
        }

        // Задать кастомные id, чтобы определять в документе нужные объекты
        new_inspection.querySelector('#hasNestedPlusButton').setAttribute('id', `hasNestedPlusButton_${inspection.id}`);
        new_inspection.querySelector('#hasNestedMinusButton').setAttribute('id', `hasNestedMinusButton_${inspection.id}`);
        new_inspection.querySelector('#addInspetionButtonMini').setAttribute('id', `addInspetionButtonMini_${patient.id}`);
        new_inspection.querySelector('#childrenInspections').setAttribute('id', `childrenInspections_${inspection.id}`);

        if(urlParams.has("grouped")){
            if(urlParams.get("grouped")){
                let depth = 0;
                const chain = await get_inspection_chain(inspection.id);
                let prev_object = new_inspection;
                let prev_id = inspection.id;
                for (let j = 0; j < chain.length; j++) {
                    const little_inspection = chain[j];
                    let new_inspection_child = inspectionSample.cloneNode(true);

                    new_inspection_child.querySelector('#inspectionDate').innerHTML = await parse_date_birthday(little_inspection.date);
                    
                    new_inspection_child.querySelector('#inspectionConclusion').innerHTML = little_inspection.conclusion;
                    new_inspection_child.querySelector('#inspectionDoctorOwner').innerText = little_inspection.doctor;
            
                    new_inspection_child.setAttribute('id', `inspectionObject_${little_inspection.id}`);
                    if (little_inspection.conclusion == "Death") {
                        new_inspection_child.querySelector('#inspection_box_object').classList.add('red-box');
                        new_inspection_child.querySelector('#addInspetionButtonMini').style.display = 'none';
                    }

                    if (little_inspection.hasNested == true) {
                        new_inspection_child.querySelector('#addInspetionButtonMini').style.display = 'none';           
                        new_inspection_child.querySelector('#hasNestedPlusButton').style.display = '';
                    }

                    // Задать кастомные id, чтобы определять в документе нужные объекты
                    new_inspection_child.querySelector('#hasNestedPlusButton').setAttribute('id', `hasNestedPlusButton_${little_inspection.id}`);
                    new_inspection_child.querySelector('#hasNestedMinusButton').setAttribute('id', `hasNestedMinusButton_${little_inspection.id}`);
                    new_inspection_child.querySelector('#childrenInspections').setAttribute('id', `childrenInspections_${little_inspection.id}`);

                    //if (depth == 0) {
                        new_inspection_child.classList.add('inspection-inlined');
                    // }
                    // else if (depth == 1) {
                    //     new_inspection_child.classList.add('inspection-inlined');
                    //     new_inspection_child.querySelector('#branch').style.display = 'none';
                    // }
                    // else {
                    //     new_inspection_child.querySelector('#branch').style.display = 'none';
                    // }

                    prev_object.querySelector(`#childrenInspections_${prev_id}`).appendChild(new_inspection_child);

                    prev_object = new_inspection_child;
                    prev_id = little_inspection.id;
                    
                    depth += 1;
                }
            }
        }

       

        document.getElementById('inspetions_box').appendChild(new_inspection);
    }
}

async function get_inspection_chain(parent_id) {
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/inspection/${parent_id}/chain`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            let responceError = await response.error.json();
            console.log(responceError.message);
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

async function get_patient() {
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/patient/${patient_id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            let responceError = await response.error.json();
            console.log(responceError.message);
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
async function get_inspection_patient_sample() {
    return fetch('http://localhost/template/inspection_sample.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.text();
    })
    .then(htmlTemplate => {
        const parser = new DOMParser();
        let inspectionTemplate = parser.parseFromString(htmlTemplate, 'text/html');
        return inspectionTemplate.getElementsByTagName('div')[0];
    })
    .catch(error => {
        console.error('Error fetching and inserting post template:', error);
    });
}

async function get_patient_ispections(params) {
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/patient/${patient_id}/inspections?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            let responceError = await response.error.json();
            console.log(responceError.message);
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

async function set_patinet_profile(patient){
    let gender_emoji = "🧑";
    if (patient.gender == "Female") {
        gender_emoji = "👩";
    }
    document.getElementById('patientCardName').innerText = `${patient.name} ${gender_emoji}`;
    document.getElementById('patientBirthday').innerText = `Дата рождения: ${await parse_date_birthday(patient.birthday)}`;
}

document.getElementById('searchPatientButton').addEventListener('mousedown', async function () {
    let urlParams = new URLSearchParams(window.location.search);
    let grouped = document.getElementById('flexRadioInspectionInput1').checked;
    let size = document.getElementById('inspectionPageCountSelect1').value;
    let codes = document.getElementById('ISD10SelectInupt').value;

    if(!urlParams.has("page")) {
        urlParams.append("page", 1);
    }
    
    if(!urlParams.has("size")) {
        urlParams.append("size", 5);
    }
    else {
        urlParams.set('size', size);
    }
    if(!urlParams.has("icdRoots")) {
        if (codes != '') {
            urlParams.append("icdRoots", [codes]);
        }
    }
    else {
        if (codes != '') {
            urlParams.set('icdRoots', [codes]);
        }
        else {
            urlParams.remove('icdRoots');
        }
    }
    if(!urlParams.has("grouped")) {
        urlParams.append("grouped", grouped);
    }
    else {
        urlParams.set('grouped', grouped);
    }

    window.location.href = window.location.href.split('?')[0] + '?' + urlParams.toString();
});

async function set_filtration_params(params){
    if (params.has('size')) {
        document.getElementById('inspectionPageCountSelect1').value = params.get('size');
    }
    if (params.has('grouped')) {
        if (params.get('grouped').toString() == 'true') {
            document.getElementById('flexRadioInspectionInput1').checked = true;
        }
    }
    if (params.has('icdRoots')) {
        console.log(params.get('icdRoots'), "khuygsuyg");
        document.getElementById('ISD10SelectInupt').value = params.get('icdRoots');
    }
}

