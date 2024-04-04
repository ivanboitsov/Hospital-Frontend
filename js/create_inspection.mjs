let diagnoses = [];
let consultations = [];
const patientId = localStorage.getItem("patientId");
const patient = await get_patient();

await set_patinet_profile(patient);

document.getElementById('cancelInspectionButton').addEventListener('click', function(event) {
    window.location.href = `/patient/${patientId}`;
});

document.getElementById('saveInspectionButton').addEventListener('click', async function(event) {
    const date = document.getElementById("inspectionDateInput1").value;
    const firstTimeCheckbox = document.getElementById("firstTimeCheckbox").checked;
    const complaintInput = document.getElementById("complaintInput1").value;
    const anamnesisDeseaseInput = document.getElementById("anamnesisDeseaseInput1").value;
    const healingRecomendInput = document.getElementById("healingRecomendInput1").value;
    const conclusionInput = document.getElementById("conclusionInput1").value;

    let deathDate = null;
    let visitDate = null;
    
    if (date != '') {
        if (new Date(date) >= new Date()) {
            alert('Дата осмотра не может быть в будущем!');
            return;
        }

        if (complaintInput != '') {
            if (anamnesisDeseaseInput != '' ){
                if (healingRecomendInput != '') {
                    if (conclusionInput == "Desiase") {
                        visitDate = document.getElementById('inspectionNextDateInput1').value;
                    }
                    else if (conclusionInput == "Death") {
                        deathDate = document.getElementById('inspectionNextDateInput1').value;
                    }
                }
            }
            else {
                alert('кал');
                return;
            }
        }
        else {
            alert('кал');
            return;
        }
    }
    else {
        alert('кал');
        return;
    }
       
    let dataBody = JSON.stringify({
        "date": date,
        "anamnesis": anamnesisDeseaseInput,
        "complaints": complaintInput,
        "treatment": healingRecomendInput,
        "conclusion": conclusionInput,
        "nextVisitDate": visitDate,
        "deathDate": deathDate,
        "previousInspectionId": null,
        "diagnoses": diagnoses,
        "consultations": consultations,
    })
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/patient/${patientId}/inspections`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
            },
            body: dataBody,
        });
    
        if (!response.ok) {
            let responceError = await response.json();
            console.log(responceError.message);
            console.log(dataBody);
            console.log(localStorage.getItem('userToken'));
            console.log(patientId);
            if (response.status == 401) {
                window.location.href = '/login/';
            }
            throw new Error(`Server Response Not Ok: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log(data);
        return data;
    
    } catch (error) {
        console.error('Fetch Error:', error);
    }

});


async function set_patinet_profile(patient){
    let gender_emoji = "🧑";
    if (patient.gender == "Female") {
        gender_emoji = "f";
    }
    document.getElementById('patientName').innerText = `${patient.name} ${gender_emoji}`;
    document.getElementById('patientBirthDate').innerText = `Дата рождения: ${await parse_date_birthday(patient.birthday)}`;
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


async function get_patient() {
    try {
        const response = await fetch(`https://mis-api.kreosoft.space/api/patient/${patientId}`, {
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