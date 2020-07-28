let razonSocial = document.getElementById('inputRznSocial').value;
let rut = document.getElementById('rut').value;
let giroEmisor = document.getElementById('giroEmisor').value;
let selector = document.getElementById("classSelect");
selector.addEventListener("change", addClasses);

let myCheck = document.getElementById('myCheck');
let details = false;
function añadirDetalles(){
    if(myCheck.checked == true){
        details = true;
    }else if (myCheck.checked == false) {
        details= false;
    }
    console.log(details)
}


const url = 'http://localhost:5000';

let oldClass = "";

function addClasses() {
    let content = document.getElementById('title');
    let newClass = "move-to-" + this.value;
    if (oldClass) {
        content.classList.remove(oldClass);
    }

    content.classList.add(newClass);

    oldClass = newClass;
}


const downloadPdf = async () => {
    event.preventDefault();

    let razonSocial = document.getElementById('inputRznSocial').value;
    let rut = document.getElementById('inputRut').value;
    let giroEmisor = document.getElementById('giroEmisor').value;

    let args = document.getElementById('classSelect');
    let valueargs = args.options[args.selectedIndex].value;

    // console.log(valueargs)

    const data = {
        razonSocial: razonSocial,
        rut: rut,
        giroEmisor: giroEmisor,
        details: details,
        options: {
            option1: valueargs
        }
    }

    fetch(`${url}/create-pdf`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            res.json()
        })
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}


function getVal() {
    let razonSocial = document.getElementById('inputRznSocial').value;
    let rut = document.getElementById('inputRut').value;
    let giroEmisor = document.getElementById('giroEmisor').value;

    document.getElementById('title').innerHTML = razonSocial;
    document.getElementById('rut').innerHTML = rut;
    document.getElementById('ejemplo').innerHTML = giroEmisor;
}



