// FUNCIÓN PARA BOTON DE RETORNO A INDEX

document.getElementById('returnButton').addEventListener('click', function (event) {
    const confirmation = confirm('Are you sure you want to go back to the beginning? Unsaved changes will be lost.');
    if (confirmation) {
        window.location.href = 'index.html';
    }
});

// FUNCIÓN PARA RECUPERAR DEL LOCAL STORAGE EL USERNAME

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('designerName').value = username;
    }
});

// FUNCIÓN PARA COMPROBAR SI HAY INFO EN EL LOCALSTORAGE Y RELLENAR EL FORMULARIO AUTOMATICAMENTE AL ABRIRSE

document.addEventListener('DOMContentLoaded', function () {
    const visibleForms = JSON.parse(localStorage.getItem('visibleForms')) || {};

    Object.keys(visibleForms).forEach(formId => {
        if (visibleForms[formId]) {
            const form = document.getElementById(`${formId.toLowerCase()}Form`); // Ej: 'electricForm', 'gasForm'
            if (form) {
                form.style.display = 'block'; // Mostrar el formulario
            }
        }
    });

    // Si tienes lógica para cargar datos en los formularios, colócala aquí
    const loadedData = localStorage.getItem('loadedFormData');

    if (loadedData) {
        const formData = JSON.parse(loadedData);

        Object.keys(formData).forEach(key => {
            const value = formData[key];

            // Busca inputs por name o id
            const radios = document.querySelectorAll(`input[name="${key}"]`);
            if (radios.length > 0) {
                // Verifica y marca el radio correspondiente
                radios.forEach(radio => {
                    if (radio.value === value) {
                        radio.checked = true;
                    }
                });
            } else {
                // Maneja otros tipos de inputs
                const input = document.getElementById(key);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            }
        });

        // Inicia la función validateForm
        validateForm();

        // Condicionales para activar los toggles si hay al menos un checkbox marcado
        if (hasCheckedCheckboxes('HVForm')) {
            toggleSubButtonsElec('electricSubBtns');
        }
        if (hasCheckedCheckboxes('MPForm')) {
            toggleSubButtonsGas('gasSubBtns');
        }
        if (hasCheckedCheckboxes('NAVForm')) {
            toggleSubButtonsWater('waterSubBtns');
        }

        // Inicia la función finishButton
        finishButton();

        // Actualiza el DOM si es necesario (por ejemplo, opciones anidadas)
        updateNestedOptions();

        // Limpia el localStorage después de cargar datos
        localStorage.removeItem('loadedFormData');
    }
});

function updateNestedOptions() {
    const parentCheckboxes = document.querySelectorAll('.parent'); // Busca checkboxes con clase 'parent'
    parentCheckboxes.forEach(parentCheckbox => {
        const nestedOptions = document.getElementById(parentCheckbox.dataset.target); // Usa un atributo data para enlazar
        if (nestedOptions) {
            nestedOptions.style.display = parentCheckbox.checked ? 'block' : 'none';
        }
    });
}

// Función para verificar si hay checkboxes marcados en un formulario específico
function hasCheckedCheckboxes(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    return Array.from(checkboxes).some(checkbox => checkbox.checked);
}


// FUNCION UNIVERSAL PARA LAS OPCIÓNES DESPLEGABLES DE CHECKBOX Y DE RADIO

/**
 * Función genérica para manejar checkboxes y subopciones
 * @param {string} checkboxId - El ID del checkbox principal
 * @param {string} subOptionsContainerId - El ID del contenedor de subopciones
 */
function handleSubOptions(checkboxId, subOptionsContainerId) {
    const checkbox = document.getElementById(checkboxId);
    const subOptionsContainer = document.getElementById(subOptionsContainerId);

    if (!checkbox || !subOptionsContainer) {
        console.warn(`No se encontró el checkbox (${checkboxId}) o el contenedor de subopciones (${subOptionsContainerId})`);
        return;
    }

    // Mostrar u ocultar subopciones basándose en el estado del checkbox
    if (checkbox.checked) {
        subOptionsContainer.style.display = 'block';
    } else {
        subOptionsContainer.style.display = 'none';

        // Desmarcar todas las subopciones anidadas si el checkbox principal está desmarcado
        const inputs = subOptionsContainer.querySelectorAll('input');
        inputs.forEach(input => input.checked = false);

        // Esconder subopciones anidadas
        const nestedSubOptions = subOptionsContainer.querySelectorAll('div');
        nestedSubOptions.forEach(div => div.style.display = 'none');
    }
}

/**
 * Para manejar checkboxes de tipo radio
 * @param {string} checkboxId 
 * @param {string} subOptionsContainerId
 */
function handleRadioSubOptions(checkboxId, subOptionsContainerId) {
    const checkbox = document.getElementById(checkboxId);
    const subOptionsContainer = document.getElementById(subOptionsContainerId);

    if (!checkbox || !subOptionsContainer) {
        console.warn('No se encontró el contenedor de subopciones.');
        return;
    }

    if (checkbox.checked) {
        subOptionsContainer.style.display = 'block';
    } else {
        subOptionsContainer.style.display = 'none';

        // Desmarcar opciones anidaras basadas en inputs tipo radio
        const radios = subOptionsContainer.querySelectorAll('input[type="radio"]');
        radios.forEach(inputRadio => inputRadio.checked = false);
    }
}

// Llamamos las funciones en base al DOM
document.addEventListener('DOMContentLoaded', function () {
    const subCheckboxes = {
        'drainage': 'drainageSubOptions',
        'meterPos': 'meterSubOptions',
        'electricCheckbox': 'elecPOCSubOptions',
        'subCheckbox': 'substationSubOptions',
        'subCheckbox_Substation_Enclosure': 'subEnclosureSubOptions',
        'MSDBCheckbox': 'MSDBSubOptions',
        'MSDBCheckbox_Meter_location': 'MSDBMeterSubOptions',
        'PVCheckbox': 'PVSubOptions',
        'SLCheckbox': 'SLSubOptions',
        'addCheckbox': 'addSubOptions',
        'addCheckbox_TBS_(Temporary_Building_Supply)': 'TBSSubOptions',
        'addCheckbox_FP_(Feeder_Pilar)': 'FPSubOptions',
        'addCheckbox_HO_(Hyper_Optic)': 'HOSubOptions',
        'addCheckbox_EVC_(Electric_Vehicle_Charger)': 'EVCSubOptions',
        'addCheckbox_Pumping_Station': 'pumpSubOptions',
        'addCheckbox_Commercial_Unit': 'comSubOptions',
        'gasSupCheckbox': 'gasSupSubOptions',
        'meteringTypeCheckbox': 'gasMeteringTypeSubOptions',
        'commercialCheckbox': 'commercialSubOptions',
        'PRICheckbox': 'PRISubOptions',
        'WPOCCheckbox': 'WPOCSubOptions'
    };

    Object.entries(subCheckboxes).forEach(([key, subElId]) => {
        handleSubOptions(key, subElId);
    });
});

// FUNCIÓN PARA CONFIRMAR LA MISSING INFO DE LAS UTILITIES E IMPRIMIR POR PANTALLA LA INFO FALTANTE

function finishButton() {
    console.log('El botón de prueba funciona');
    const finishDiv = document.getElementById('missingUtilitiesInfo');
    finishDiv.innerHTML = ''; // Borra el contenido del div

    // Campos principales y su jerarquía con categorías
    const utilitiesFields = [
        // ELECTRIC FORM ITEMS
        { id: 'electricCheckbox', label: 'Electric POC', formId: 'HVForm', category: 'Electric', subOptions: {
            'Design Document': [],
            'Quote Letter': []
        }},
        { id: 'subCheckbox', label: 'Substation', formId: 'HVForm', category: 'Electric', subOptions: {
            'Substation Location': [],
            'Substation Enclosure': ['GRP', 'Brick Built']
        }},
        { id: 'MSDBCheckbox', label: 'MSDB', formId: 'HVForm', category: 'Electric', subOptions: {
            'Floor plans in DWG': [],
            'MSDB location': [],
            'Landlord Supplies loads & phases': [],
            'Meter location': ['Communaly in MSDB room at ground floor', 'Communaly in riser rooms at each floor', 'On each flat']
        }},
        { id: 'PVCheckbox', label: 'PV Panels', formId: 'HVForm', category: 'Electric', subOptions: {
            'With Export load': [],
            'Not Export': []
        }},
        { id: 'SLCheckbox', label: 'Street Lights', formId: 'HVForm', category: 'Electric', subOptions: {
            'Street lights plan in DWG': [],
            'Street lights type (public & private)': []
        }},
        { id: 'addCheckbox', label: 'Additional Loads', formId: 'HVForm', category: 'Electric', subOptions: {
            'TBS (Temporary Building Supply)': ['Location of TBS','TBS Load','Phases of supply for TBS'],
            'FP (Feeder Pilar)': ['Location of FP','FP Load','Phases of supply for FP'],
            'HO (Hyper Optic)': ['Location of HO','HO Load','Phases of supply for HO'],
            'EVC (Electric Vehicle Charger)': ['Fast Type','Slow Type'],
            'Pumping Station': ['Location of Pumping Station','Data Sheet','Phases of supply for Pump'],
            'Commercial Unit': ['Location of Commercial','Load for Commercial','Phases of supply for commercial','Building Construction Type']
        }},

        // GAS FORM ITEMS
        { id: 'PRICheckbox', label: 'PRI', formId: 'MPForm', category: 'Gas', subOptions: {
            'Above Ground': [],
            'Below Ground': []
        }},
        { id: 'gasSupCheckbox', label: 'Gas Supplier', formId: 'MPForm', category: 'Gas'},
        { id: 'meteringTypeCheckbox', label: 'Metering Type', formId: 'MPForm', category: 'Gas', subOptions: {
            'Smart': [],
            'Dumb': []
        }},
        { id: 'commercialCheckbox_Load_for_the_commercial_is_missing', label: 'Load for the commercial is missing', formId: 'MPForm', category: 'Gas'},
        

        // WATER FORM ITEMS
        { id: 'waterCompanyCheckbox', label: 'Water company Reference', formId: 'NAVForm', category: 'Water'},
        { id: 'riskCheckbox', label: 'Risk Assessment', formId: 'NAVForm', category: 'Water'},
        { id: 'f10Checkbox', label: 'F10 Notification', formId: 'NAVForm', category: 'Water'},
        { id: 'EnvCheckbox', label: 'Environmental Report', formId: 'NAVForm', category: 'Water'},
        { id: 'TopoCheckbox', label: 'Topografical Survey', formId: 'NAVForm', category: 'Water'},
        { id: 'WPOCCheckbox', label: 'Water POC Plan', formId: 'NAVForm', category: 'Water', subOptions: {
            'Design Document': [],
            'POC Letter': []
        }},
        { id: 'NAVCheckbox', label: 'NAV Adoption', formId: 'NAVForm', category: 'Water'}
    ];

    let missingUtilitiesFields = {
        Electric: [],
        Gas: [],
        Water: []
    };

    function checkSubOptions(subOptions, parentId) {
        let missingSubOptions = [];

        // Verificar si subOptions es válido
        if (!subOptions || typeof subOptions !== 'object') {
            return missingSubOptions; // Si no hay subopciones, detener la recursión
        }

        Object.keys(subOptions).forEach(optionLabel => {
            const subOptionId = `${parentId}_${optionLabel.replace(/\s+/g, '_')}`; // Generar ID único
            const checkbox = document.getElementById(subOptionId);

            // Si la subopción es un checkbox
            if (checkbox && checkbox.type === 'checkbox') {
                // Si el checkbox padre no está marcado, ignorar subopciones anidadas
                if (!checkbox.checked) {
                    missingSubOptions.push(optionLabel); // Agregar subopción no marcada
                    return; // Salir de esta iteración, no procesar subniveles
                }
            }

            // Si la subopción es un radio y no está marcado
            else if (checkbox && checkbox.type === "radio") {
                const radios = document.querySelectorAll(`input[type="radio"][name="${checkbox.name}"]`);
                const isAnyRadioSelected = Array.from(radios).some(radio => radio.checked);

                if (!isAnyRadioSelected) {
                    missingSubOptions.push(optionLabel);
                }
            }

            // Si hay subniveles (arrays con subopciones), procesarlos recursivamente
            const nestedOptions = subOptions[optionLabel];
            if (Array.isArray(nestedOptions) && nestedOptions.length > 0 && checkbox && checkbox.checked) {
                const nestedMissing = checkSubOptions(
                    nestedOptions.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
                    subOptionId
                );
                missingSubOptions = missingSubOptions.concat(nestedMissing);
            }
        });

        return missingSubOptions;
    }

    // Verificar campos principales y subopciones
    utilitiesFields.forEach(field => {
        const form = document.getElementById(field.formId); // Formulario asociado

        // Asegúrate de que el formulario esté activo antes de procesar
        if (form && window.getComputedStyle(form).display !== 'none') {
            const checkbox = document.getElementById(field.id);

            // Si el checkbox principal está marcado, verificar subopciones
            if (checkbox && checkbox.checked) {
                const missingSubOptions = checkSubOptions(field.subOptions, field.id);
                if (missingSubOptions.length > 0) {
                    missingUtilitiesFields[field.category].push(`${field.label}: <br> ${missingSubOptions.join('<br>')}`);
                }
            } 
            // Si el checkbox principal no está marcado
            else if (!checkbox || !checkbox.checked) {
                missingUtilitiesFields[field.category].push(field.label);
            }
        }
    });

    // Mostrar los resultados clasificados por categoría
    const missingUtilitiesFieldset = document.querySelector('.missingUtilitiesInfo');
    if (Object.values(missingUtilitiesFields).some(fields => fields.length > 0)) {
        missingUtilitiesFieldset.style.display = 'block';

        let resultHTML = '';
        
        // Agregar Electric
        if (missingUtilitiesFields.Electric.length > 0) {
            resultHTML += `<strong><h3>Electric:</h3></strong><ul>${missingUtilitiesFields.Electric.map(field => `<li>${field}</li>`).join('')}</ul>`;
        }

        // Agregar Gas
        if (missingUtilitiesFields.Gas.length > 0) {
            resultHTML += `<strong><h3>Gas:</h3></strong><ul>${missingUtilitiesFields.Gas.map(field => `<li>${field}</li>`).join('')}</ul>`;
        }

        // Agregar Water
        if (missingUtilitiesFields.Water.length > 0) {
            resultHTML += `<strong><h3>Water:</h3></strong><ul>${missingUtilitiesFields.Water.map(field => `<li>${field}</li>`).join('')}</ul>`;
        }

        finishDiv.innerHTML = resultHTML;
        finishDiv.style.color = 'red';
    } else {
        missingUtilitiesFieldset.style.display = 'block';
        finishDiv.innerHTML = 'All information needed is complete.';
        finishDiv.style.color = 'black';
    }
}

// FUNCIÓN PARA VALIDAR LA MANDATORY INFO E IMPRIMIR UN LISTADO CON LA MISSING INFO

const validateForm = () => {

    // Validar campos obligatorios y sus subopciones
    const mandatoryFields = [
        { id: 'loaCheckbox', label: 'Letter of Authority' },
        { id: 'siteLayout', label: 'Site Layout in DWG' },
        { id: 'drainage', label: 'Drainage' },
        { id: 'meterPos', label: 'Meter Position' },
        { id: 'assValue', label: 'Asset Value' },
        { id: 'conPlan', label: 'Conveyancing Plan' },
        { id: 'accSchedule', label: 'Accommodation Schedule' },
        { id: 's38', label: 'S38 Plan' },
        { id: 's278', label: 'S278 Plan' },
        { id: 'siteExPlan', label: 'Site Execution Plan' }
    ];

    const subOptions = {
        drainage: ['Drainage DWG file', 'Drainage PDF file'],
        meterPos: ['Meter position DWG file', 'Meter position PDF file']
    };

    let missingFields = [];

    // Validar los campos principales
    mandatoryFields.forEach(field => {
        const checkbox = document.getElementById(field.id);
        if (checkbox && !checkbox.checked) {
            missingFields.push(field.label);
        }
    });

    // Validar subopciones si los campos principales están marcados
    Object.keys(subOptions).forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox && checkbox.checked) {
            subOptions[option].forEach(subOptionLabel => {
                const subCheckboxes = document.querySelectorAll(`input[name="${option}Options"]`);
                const isSubOptionChecked = Array.from(subCheckboxes).some(subCheckbox =>
                    (subCheckbox.value.toLowerCase() === subOptionLabel.toLowerCase() && subCheckbox.checked) ||
                    (subCheckbox.type === 'text' && subCheckbox.value.trim() !== '')
                );
                if (!isSubOptionChecked) missingFields.push(subOptionLabel);
            });
        }
    });

    // Mostrar campos faltantes
    const messageDiv = document.getElementById('missingMandatoryInfo');
    const missingInfoFieldset = document.querySelector('.missingInfo');
    const utilitiesBtnDiv = document.querySelector('.utilities-btn');
    const sectionButtons = document.querySelectorAll('.sec-btn-align');

    if (missingFields.length > 0) {
        missingInfoFieldset.style.display = 'block';
        messageDiv.innerHTML = `<strong><h3>The following mandatory elements are missing:</h3></strong><ul>${missingFields.map(field => `<li>${field}</li>`).join('')}</ul>`;
        messageDiv.style.color = 'red';
        utilitiesBtnDiv.style.display = 'block';
    } else {
        missingInfoFieldset.style.display = 'block';
        messageDiv.innerHTML = 'All mandatory information needed is complete.';
        messageDiv.style.color = 'black';
        utilitiesBtnDiv.style.display = 'block';
    }

    // Mostrar botones de sección
    sectionButtons.forEach(button => {
        button.style.display = 'block';
    });
};

// Función para mostrar/ocultar subbotones de sección Electric
function toggleSubButtonsElec(subButtonsId) {
    const subButtons = document.getElementById(subButtonsId);
    const form = document.getElementById('HVForm'); // Seleccionamos el formulario por su ID

    // Alternar visibilidad de los sub-botones
    if (subButtons.style.display === 'block') {
        subButtons.style.display = 'none';
    } else {
        subButtons.style.display = 'block';
    }

    // Alternar visibilidad del formulario
    if (form) { // Asegurarnos de que el formulario exista
        if (form.style.display === 'block') {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
        }
    }
}

// Función para mostrar/ocultar subbotones de sección Gas
function toggleSubButtonsGas(subButtonsId) {
    const subButtons = document.getElementById(subButtonsId);
    const form = document.getElementById('MPForm'); // Seleccionamos el formulario por su ID

    // Alternar visibilidad de los sub-botones
    if (subButtons.style.display === 'block') {
        subButtons.style.display = 'none';
    } else {
        subButtons.style.display = 'block';
    }

    // Alternar visibilidad del formulario
    if (form) { // Asegurarnos de que el formulario exista
        if (form.style.display === 'block') {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
        }
    }
}

// Función para mostrar/ocultar subbotones de sección Water
function toggleSubButtonsWater(subButtonsId) {
    const subButtons = document.getElementById(subButtonsId);
    const form = document.getElementById('NAVForm'); // Seleccionamos el formulario por su ID

    // Alternar visibilidad de los sub-botones
    if (subButtons.style.display === 'block') {
        subButtons.style.display = 'none';
    } else {
        subButtons.style.display = 'block';
    }

    // Alternar visibilidad del formulario
    if (form) { // Asegurarnos de que el formulario exista
        if (form.style.display === 'block') {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
        }
    }
}

// FUNCIÓN PARA MOSTRAR FORMULARIO DE HV O DE LV

function toggleElecForm(formType) {
    // Asegúrate de que el formulario general esté visible
    document.getElementById('HVForm').style.display = 'block';

    // Obtén todos los checkboxes y radio buttons dentro de 'substationEnclosureSection'
    const inputsElec = document.querySelectorAll('#substationEnclosureSection input[type="checkbox"], #substationEnclosureSection input[type="radio"]');

    if (formType === 'elecHV') {
        document.getElementById('substationEnclosureSection').style.display = 'block';
        document.querySelector('#HVForm legend').textContent = 'Electric HV Form';

        // Asegúrate de mostrar todos los inputs
        inputsElec.forEach(input => {
            input.style.display = 'inline-block'; // Muestra como inline-block o inline según sea necesario
        });

    } else if (formType === 'elecLV') {
        document.getElementById('substationEnclosureSection').style.display = 'none';
        document.querySelector('#HVForm legend').textContent = 'Electric LV Form';

        // Marca y oculta todos los checkboxes y radio buttons
        inputsElec.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = true; // Marca los checkboxes
            } else if (input.type === 'radio') {
                // Si es un radio button, selecciona el primero de su grupo (por `name`)
                const groupElec = document.querySelectorAll(`input[type="radio"][name="${input.name}"]`);
                if (groupElec[0] === input) {
                    input.checked = true; // Selecciona el primer radio de su grupo
                }
            }
            input.style.display = 'none'; // Oculta visualmente
        });
    }
}

// FUNCIÓN PARA MOSTRAR FORMULARIO DE MP O DE LP

function toggleGasForm(formType) {
    // Asegúrate de que el formulario general esté visible
    document.getElementById('MPForm').style.display = 'block';

    // Obtén todos los checkboxes y radio buttons dentro de 'substationEnclosureSection'
    const inputsGas = document.querySelectorAll('#PRISection input[type="checkbox"], #PRISection input[type="radio"]');

    if (formType === 'gasMP') {
        document.getElementById('PRISection').style.display = 'block';
        document.querySelector('#MPForm legend').textContent = 'MP Gas Form';

        // Asegúrate de mostrar todos los inputs
        inputsGas.forEach(input => {
            input.style.display = 'inline-block'; // Muestra como inline-block o inline según sea necesario
        });

    } else if (formType === 'gasLP') {
        document.getElementById('PRISection').style.display = 'none';
        document.querySelector('#MPForm legend').textContent = 'LP Gas Form';

        // Marca y oculta todos los checkboxes y radio buttons
        inputsGas.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = true; // Marca los checkboxes
            } else if (input.type === 'radio') {
                // Si es un radio button, selecciona el primero de su grupo (por `name`)
                const groupGas = document.querySelectorAll(`input[type="radio"][name="${input.name}"]`);
                if (groupGas[0] === input) {
                    input.checked = true; // Selecciona el primer radio de su grupo
                }
            }
            input.style.display = 'none'; // Oculta visualmente
        });
    }
}

// FUNCIÓN PARA MOSTRAR FORMULARIO DE NAV O SLA

function toggleWaterForm(formType) {
    // Asegúrate de que el formulario general esté visible
    document.getElementById('NAVForm').style.display = 'block';

    // Obtén todos los checkboxes dentro de 'substationEnclosureSection'
    const checkboxes = document.querySelectorAll('#POCPlanSection input[type="checkbox"]');

    if (formType === 'waterNAV') {
        document.getElementById('POCPlanSection').style.display = 'block';
        document.querySelector('#NAVForm legend').textContent = 'NAV Water Form';

        // Asegúrate de mostrar los checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.style.display = 'inline-block'; // O muestra como inline-flex o inline según sea necesario
        });

    } else if (formType === 'waterSLA') {
        document.getElementById('POCPlanSection').style.display = 'none';
        document.querySelector('#NAVForm legend').textContent = 'SLA Water Form';

        // Mantén los checkboxes y sus subopciones marcados pero invisibles
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Marca todos los checkboxes (directos e hijos)
            checkbox.style.display = 'none'; // Oculta visualmente todos los checkboxes
        });
    }
}

// FUNCIÓN PARA GUARDAR LA INFORMACIÓN DEL FORM Y CONVERTIRLA EN UN ARCHIVO .JSON

document.getElementById('saveFormButton').addEventListener('click', function () {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else if (input.type === 'radio') {
            if (input.checked) {
                console.log(`Radio ${input.name}: ${input.value}`);
                formData[input.name] = input.value;
            }
        } else {
            formData[input.id] = input.value;
        }
    });

    console.log(formData);

    // Pedir al usuario el nombre del archivo
    const fileName = prompt("Por favor, ingresa el nombre del archivo (sin extensión):", "formData");
    if (fileName) {
        const dataStr = JSON.stringify(formData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert("Se canceló el guardado del archivo.");
    }
});


// LOGICA PARA EL MENU DESPLEGABLE DEL HEADER

document.getElementById('menuToggle').addEventListener('click', function () {
    const navigationMenu = document.getElementById('navigationMenu');
    if (navigationMenu.style.display === 'block') {
        navigationMenu.style.display = 'none';
    } else {
        navigationMenu.style.display = 'block';
    }
});

// LOGICA PARA MANEJAR LA APARICION O NO DE CIERTOS ELEMENTOS



function toggleSection(sectionId, include) {
    const section = document.getElementById(sectionId);
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');

    if (include) {
        section.style.display = 'block'; // Mostrar sección
    } else {
        section.style.display = 'none'; // Ocultar sección
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Marca todos los checkboxes (directos e hijos)
        });
    }
}

