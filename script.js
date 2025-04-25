// Elimina la definici\u00F3n hardcodeada del array const allPlayers = [...]
// allPlayers ser\u00E1 llenado por la funci\u00F3n loadPlayersJson
let allPlayers = [];

// Definici\u00F3n de tus formaciones (esto se mantiene igual)
const formations = {
    "433": [
        // ... tus coordenadas para 433 en campo horizontal, tu porter\u00EDa a la izquierda ...
        { x: 5, y: 50, type: 'GK' }, // Portero (cerca de la izquierda, centrado vertical)
        { x: 22, y: 15, type: 'LB' }, // Lateral Izquierdo (derecha de GK, arriba)
        { x: 22, y: 37, type: 'CB' }, // Central 1 (derecha de GK, centrado-arriba)
        { x: 22, y: 60, type: 'CB' }, // Central 2 (derecha de GK, centrado-abajo)
        { x: 22, y: 85, type: 'RB' }, // Lateral Derecho (derecha de GK, abajo)
        { x: 40, y: 30, type: 'CM' }, // Mediocentro Izquierdo (medio campo, arriba)
        { x: 35, y: 50, type: 'MDC' }, // Pivote/Mediocentro Defensivo (medio campo, centrado)
        { x: 40, y: 70, type: 'CM' }, // Mediocentro Derecho (medio campo, abajo)
        { x: 55, y: 18, type: 'LW' }, // Extremo Izquierdo (cerca de porter\u00EDa rival, arriba)
        { x: 60, y: 50, type: 'ST' }, // Delantero Centro (cerca de porter\u00EDa rival, centrado)
        { x: 55, y: 82, type: 'RW' }
    ],
    "442": [
        // ... tus coordenadas para 442 en campo horizontal, tu porter\u00EDa a la izquierda ...
        { x: 5, y: 50, type: 'GK' }, // Portero (cerca de la izquierda, centrado vertical)
        { x: 22, y: 15, type: 'LB' }, // Lateral Izquierdo (derecha de GK, arriba)
        { x: 22, y: 37, type: 'CB' }, // Central 1 (derecha de GK, centrado-arriba)
        { x: 22, y: 60, type: 'CB' }, // Central 2 (derecha de GK, centrado-abajo)
        { x: 22, y: 85, type: 'RB' }, // Lateral Derecho (derecha de GK, abajo)
        { x: 40, y: 15, type: 'LM' }, // Interior Izquierdo (medio campo, arriba)
        { x: 40, y: 37, type: 'CM' }, // Mediocentro 1 (medio campo, centrado-arriba)
        { x: 40, y: 60, type: 'CM' }, // Mediocentro 2 (medio campo, centrado-abajo)
        { x: 40, y: 85, type: 'RM' }, // Interior Derecho (medio campo, abajo)
        { x: 60, y: 37, type: 'ST' }, // Delantero 1 (ataque, centrado-arriba)
        { x: 60, y: 60, type: 'ST' }
    ],
    // Puedes añadir m\u00E1s formaciones aqu\u00ED
};

// ** Funci\u00F3n para mostrar mensajes de error en la interfaz **
function showErrorMessage(message) {
    const fieldContainer = document.getElementById('players-container');
    fieldContainer.innerHTML = `<p style="color: red; text-align: center; padding-top: 50px;">${message}</p>`;

    const titularesContainer = document.getElementById('starting-eleven');
    titularesContainer.innerHTML = '<p style="text-align: center;">Error al cargar jugadores.</p>';
    const benchContainer = document.getElementById('bench');
    benchContainer.innerHTML = '<p style="text-align: center;">Error al cargar jugadores.</p>';

     const formationSelect = document.getElementById('formation');
     if (formationSelect) {
         formationSelect.disabled = true;
     }
}


// ** Funci\u00F3n para cargar los jugadores desde un archivo JSON **
async function loadPlayersJson(jsonFilePath) {
    try {
        const response = await fetch(jsonFilePath);

        if (!response.ok) {
            const errorText = `Error al cargar el archivo JSON: ${response.statusText} (${response.status})`;
            console.error(errorText);
            showErrorMessage(`${errorText}<br>Aseg\u00FArate de que "${jsonFilePath}" existe en la misma carpeta.`);
            return;
        }

        const jsonData = await response.json();

        if (!Array.isArray(jsonData)) {
            console.error('El archivo JSON no contiene un array en la ra\u00EDz.');
            showErrorMessage(`Error en el formato de "${jsonFilePath}". Debe contener un array de jugadores.`);
            return;
        }

        // --- Mapear los objetos JSON a la estructura de objeto jugador esperada ---
        allPlayers = jsonData.map((playerJson, index) => {
            // Validaci\u00F3n b\u00E1sica por si falta alg\u00FAn campo esencial que necesitamos
             if (!playerJson["Nombre"] || !playerJson["Apellido"] || !playerJson["Dorsal"] || !playerJson["Mejor Posici\u00f3n"] || !playerJson["Condici\u00f3n"]) {
                 console.warn(`Saltando objeto jugador con datos incompletos (indice ${index}):`, playerJson);
                 return null; // Saltar objetos incompletos
             }

            // Usamos el \u00EDndice + 1 como ID \u00FAnico temporal. Puedes usar Dorsal si est\u00E1s seguro de que es \u00FAnico.
            const playerId = parseInt(playerJson["Dorsal"]?.trim());
            // Usar Dorsal si es un n\u00FAmero v\u00E1lido y no es 0, de lo contrario, usar el \u00EDndice
            const id = (!isNaN(playerId) && playerId > 0) ? playerId : index + 1;


            const player = {
                id: id, // Usamos el ID determinado arriba
                name: `${playerJson["Nombre"]?.trim() || ''} ${playerJson["Apellido"]?.trim() || ''}`,
                apodo: playerJson["Apodo"]?.trim() || '',
                number: parseInt(playerJson["Dorsal"]?.trim()) || 0, // Convertir a número, 0 si falla
                position: playerJson["Mejor Posición"]?.trim() || '',
            
                // ** Lógica para determinar si es titular (isStarter) usando el campo "Condición" **
                // Si la Condición es "Titular habitual" o "Jugador Importante", es titular (true). De lo contrario, es suplente (false).
                isStarter: ["Titular habitual", "Jugador Importante"].includes(playerJson["Condición"]?.trim()),
            
                // ** Posiciones elegibles (eligiblePositions) **
                eligiblePositions: [], // Empezamos con un array vacío
            
                // ** Opcional: Añade otras propiedades del JSON si quieres almacenarlas **
                pieHabil: playerJson["Pie Hábil"]?.trim() || '',
                fechaNacimiento: playerJson["Fecha de Nacimieto"]?.trim() || '',
                edad: parseInt(playerJson["Edad"]?.trim()) || null,
                alturaCm: parseInt(playerJson["Altura (cm)"]?.trim()) || null,
                pesoKg: parseFloat(playerJson["Peso (Kg)"]?.trim()) || null,
                condicion: playerJson["Condición"]?.trim() || '', // Si quieres guardar la condición original
            };

            // A\u00F1adimos "Mejor Posici\u00f3n" a las elegibles si existe y no est\u00E1 vac\u00EDa
             if (player.position) {
                 player.eligiblePositions.push(player.position);
             }

            // A\u00F1adimos "Posci\u00f3n Alterna" si existe, no est\u00E1 vac\u00EDa, y no es la misma que la principal
            // Asumimos que "Posci\u00f3n Alterna" es un solo valor string en el JSON (ej: "EI", "LTI", "LTD", etc.).
            // Si alguna entrada de "Posci\u00f3n Alterna" contiene m\u00FAltiples roles separados por ';', ',' u otro, necesitar\u00EDas un split aqu\u00ED.
            const altPos = playerJson["Posci\u00f3n Alterna"]?.trim();
            if (altPos && altPos !== '' && !player.eligiblePositions.includes(altPos)) {
                player.eligiblePositions.push(altPos);
            }

            return player; // Retornamos el objeto jugador mapeado
        }).filter(player => player !== null); // Filtramos cualquier entrada que retorn\u00F3 null


        // Validar si se cargaron jugadores v\u00E1lidos despu\u00E9s del mapeo/filtrado
         if (allPlayers.length === 0) {
             console.warn(`No se cargaron jugadores v\u00E1lidos despu\u00E9s del procesamiento de "${jsonFilePath}". Revisa el formato JSON y las claves esperadas.`);
             showErrorMessage(`No se pudieron cargar datos v\u00E1lidos de "${jsonFilePath}". Revisa su contenido y formato.`);
             const formationSelect = document.getElementById('formation');
             if (formationSelect) { formationSelect.disabled = true; }
             return;
         }


        console.log('Jugadores cargados exitosamente desde JSON:', allPlayers);

        // --- Una vez que los jugadores est\u00E1n cargados, inicializa la UI ---
        // Renderiza la formaci\u00F3n inicial y las listas de jugadores
        const formationSelect = document.getElementById('formation');
        if (formationSelect) {
            formationSelect.disabled = false; // Asegura que el selector est\u00E9 habilitado
            renderFormation(formationSelect.value);
        }

    } catch (error) {
        console.error('Error inesperado al cargar o parsear el archivo JSON:', error);
        showErrorMessage(`Error interno al procesar el archivo "${jsonFilePath}". Aseg\u00FArate de que es un JSON v\u00E1lido.`);
    }
}

// --- Funci\u00F3n para crear un elemento de jugador para el campo ---
function createFieldPlayerElement(player) {
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.textContent = player.number;
    playerElement.dataset.playerId = player.id; // Usamos el ID mapeado
    playerElement.setAttribute('draggable', true);
    playerElement.addEventListener('dragstart', dragStart);
    return playerElement;
}

// --- Funci\u00F3n para crear una tarjeta de jugador para las listas (con listener de click) ---
function createPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.dataset.playerId = player.id; // Usamos el ID mapeado
    playerCard.innerHTML = `
        <span>${player.number} - ${player.name}</span>
        <span style="font-size: 0.8em; color: #aaa; margin-left: auto;">${player.position}</span>
    `;

    // **Listener de click para mostrar posiciones elegibles**
    playerCard.addEventListener('click', (event) => {
        // Usamos showPositionDropdown (implementaci\u00F3n b\u00E1sica de desplegable)
        showPositionDropdown(player, event);
    });

    return playerCard;
}

// --- Funci\u00F3n renderFormation (usa el array allPlayers llenado por loadPlayersJson) ---
function renderFormation(formationCode) {
    // Solo renderiza si allPlayers ha sido llenado y no est\u00E1 vac\u00EDo
    if (!allPlayers || allPlayers.length === 0) {
        console.warn("allPlayers est\u00E1 vac\u00EDo. No se puede renderizar la formaci\u00F3n.");
        return;
    }

    const fieldContainer = document.getElementById('players-container');
    // Limpiamos solo los elementos .player del campo para no borrar las l\u00EDneas
    fieldContainer.querySelectorAll('.player').forEach(p => p.remove());

    const titularesContainer = document.getElementById('starting-eleven');
    titularesContainer.innerHTML = '';

    const benchContainer = document.getElementById('bench');
    benchContainer.innerHTML = '';

    const formationSlots = formations[formationCode];
    // Filtramos los jugadores *despu\u00E9s* de cargar el JSON
    // La propiedad isStarter ahora viene del JSON mapeado
    const starters = allPlayers.filter(player => player.isStarter);
    const benchPlayers = allPlayers.filter(player => !player.isStarter);

    if (starters.length < formationSlots.length) {
        console.warn(`Advertencia: La formaci\u00F3n ${formationCode} requiere ${formationSlots.length} titulares, pero solo hay ${starters.length}.`);
    }

    // Renderizar jugadores en el campo seg\u00FAn los slots de la formaci\u00F3n HORIZONTAL
    formationSlots.forEach((slot, index) => {
        // L\u00F3gica simple: asigna los primeros N titulares a los primeros N slots
        // En una aplicaci\u00F3n real, querr\u00EDas asignar jugadores por posici\u00F3n o arrastre
        const playerForSlot = starters[index];

        if (playerForSlot) {
            const playerElement = createFieldPlayerElement(playerForSlot);
            playerElement.style.left = `${slot.x}%`;
            playerElement.style.top = `${slot.y}%`;
            fieldContainer.appendChild(playerElement);
        } else {
                 console.warn(`No hay jugador titular disponible para el slot de la posición ${slot.type || 'Desconocida'} (${index + 1} de la formación ${formationCode}).`);
        }
    });

    // Renderizar las listas con los jugadores cargados
    // Limpiamos las listas antes de llenarlas
    titularesContainer.innerHTML = '';
    benchContainer.innerHTML = '';

    starters.forEach(player => {
        const playerCard = createPlayerCard(player);
        titularesContainer.appendChild(playerCard);
    });

    benchPlayers.forEach(player => {
        const playerCard = createPlayerCard(player);
        benchContainer.appendChild(playerCard);
    });
}

// --- Funciones de Drag and Drop ---
let draggedPlayerElement = null;

function dragStart(event) {
    if (event.target.classList.contains('player')) {
        draggedPlayerElement = event.target;
        // Almacena el ID del jugador que se est\u00E1 arrastrando
        event.dataTransfer.setData('text/plain', draggedPlayerElement.dataset.playerId);
    } else {
         event.preventDefault(); // Solo arrastrable si es .player
    }
}

function dragOver(event) {
    event.preventDefault(); // Permite soltar elementos
}

function drop(event) {
    event.preventDefault();
    // Solo permitir soltar si hay un elemento arrastrado y se suelta sobre el campo
    if (draggedPlayerElement && event.target.closest('.field')) {
        const field = event.target.closest('.field');
        const rect = field.getBoundingClientRect();
        // Calcular la posici\u00F3n X e Y del drop en porcentajes relativos al campo
        const x = ((event.clientX - rect.left) / rect.width) * 100; // X es horizontal
        const y = ((event.clientY - rect.top) / rect.height) * 100; // Y es vertical

        // Aplicar las coordenadas X e Y directamente a left y top
        draggedPlayerElement.style.left = `${x}%`;
        draggedPlayerElement.style.top = `${y}%`;

        // Puedes a\u00F1adir l\u00F3gica aqu\u00ED para actualizar la posici\u00F3n del jugador
        // en el array allPlayers si es necesario guardar la posici\u00F3n personalizada.

        draggedPlayerElement = null; // Limpiar el elemento arrastrado
    }
    // Nota: Para arrastrar entre listas y campo, se necesitar\u00EDa l\u00F3gica de drop m\u00E1s compleja.
}


// --- Funci\u00F3n para gestionar la visibilidad del men\u00FA desplegable de posiciones (Nuevo) ---
let currentDropdown = null; // Variable para seguir el men\u00FA desplegable abierto

function showPositionDropdown(player, event) {
    // Si ya hay un desplegable abierto, lo cerramos
    if (currentDropdown) {
        currentDropdown.remove();
        currentDropdown = null;
        return; // Solo cerramos si es el mismo jugador
    }

    const playerCard = event.target.closest('.player-card');
    if (!playerCard) return;

    if (!player.eligiblePositions || player.eligiblePositions.length === 0) {
        console.warn(`No hay posiciones elegibles definidas para ${player.name}`);
        return;
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'position-dropdown';
    dropdown.dataset.playerId = player.id;

    const rect = playerCard.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.backgroundColor = '#333';
    dropdown.style.border = '1px solid #555';
    dropdown.style.borderRadius = '5px';
    dropdown.style.zIndex = 10;
    dropdown.style.minWidth = `${playerCard.offsetWidth}px`;
    dropdown.style.padding = '5px 0';
    dropdown.style.top = `${rect.bottom + 5}px`;
    dropdown.style.left = `${rect.left}px`;

    player.eligiblePositions.forEach(position => {
        const positionItem = document.createElement('div');
        positionItem.className = 'position-item';
        positionItem.textContent = position;
        positionItem.style.padding = '8px 15px';
        positionItem.style.cursor = 'pointer';
        positionItem.style.color = '#ccc';

        positionItem.onmouseover = () => { 
            positionItem.style.backgroundColor = '#555'; 
        };
        positionItem.onmouseout = () => { 
            positionItem.style.backgroundColor = 'transparent'; 
        };

        // Modificación principal: Actualizar solo la posición del jugador sin recargar el tablero
        positionItem.onclick = () => {
            player.position = position;
            
            // Actualizar visualmente solo las tarjetas de jugadores
            const titularesContainer = document.getElementById('starting-eleven');
            const benchContainer = document.getElementById('bench');
            
            // Encontrar y actualizar la tarjeta específica que cambió
            const playerCards = [...titularesContainer.querySelectorAll('.player-card'),
                               ...benchContainer.querySelectorAll('.player-card')];
            
            const cardToUpdate = playerCards.find(card => 
                card.dataset.playerId === String(player.id));
            
            if (cardToUpdate) {
                cardToUpdate.innerHTML = `
                    <span>${player.number} - ${player.name}</span>
                    <span style="font-size: 0.8em; color: #aaa; margin-left: auto;">${player.position}</span>
                `;
            }

            dropdown.remove();
            currentDropdown = null;
            document.removeEventListener('click', handleClickOutsideDropdown, true);
        };

        dropdown.appendChild(positionItem);
    });

    document.body.appendChild(dropdown);
    currentDropdown = dropdown;
    document.addEventListener('click', handleClickOutsideDropdown, true);
}

function handleClickOutsideDropdown(event) {
    // Verifica si se hizo clic fuera del desplegable actual Y fuera de la tarjeta que lo abri\u00F3
    const playerCardClicked = event.target.closest('.player-card');
    if (currentDropdown && !currentDropdown.contains(event.target) && (!playerCardClicked || playerCardClicked.dataset.playerId !== currentDropdown.dataset.playerId) ) {

        // A\u00F1adimos una peque\u00F1a demora para evitar problemas si el click que abri\u00F3 este
        // tambi\u00E9n cierra otro o interfiere con la l\u00F3gica de apertura/cierre
         setTimeout(() => {
            if (currentDropdown) { // Verificar de nuevo si a\u00FAn existe despu\u00E9s del timeout
                currentDropdown.remove();
                currentDropdown = null;
                document.removeEventListener('click', handleClickOutsideDropdown, true); // Elimina este listener
            }
        }, 50); // Peque\u00F1a demora (50ms)

    } else if (!currentDropdown) {
         // Si el desplegable ya no existe (ej: se cerr\u00F3 al seleccionar una posici\u00F3n),
         // removemos este listener por si acaso no se elimin\u00F3 antes.
         document.removeEventListener('click', handleClickOutsideDropdown, true);
    }
}


// --- Event Listeners ---

// ** Llama a la funci\u00F3n para cargar los jugadores desde JSON cuando la p\u00E1gina cargue **
// Aseg\u00FArate de que tu archivo JSON se llama 'players.json'
// y est\u00E1 en la misma carpeta que tu archivo index.html, o proporciona la ruta correcta.
loadPlayersJson('players.json');


// A\u00F1ade event listeners para Drag and Drop en el campo
const field = document.querySelector('.field');
if (field) { // Verifica que el campo exista
    field.addEventListener('dragover', dragOver);
    field.addEventListener('drop', drop);
} else {
    console.error("Elemento con clase '.field' no encontrado.");
}


// A\u00F1ade event listener para el selector de formaci\u00F3n
const formationSelect = document.getElementById('formation');
if (formationSelect) { // Verifica que el selector exista
    formationSelect.addEventListener('change', (e) => {
        renderFormation(e.target.value);
    });
    // La llamada inicial a renderFormation ahora est\u00E1 dentro de loadPlayersJson
} else {
     console.error("Elemento con ID 'formation' no encontrado.");
}


// --- Funcionalidad adicional para futuro ---
// Implementar arrastrar jugadores desde las listas al campo y viceversa.
// Actualizar el estado isStarter de los jugadores cuando se mueven entre titulares/suplentes.
// Guardar y cargar formaciones personalizadas.
// Mejorar la UI y funcionalidad del desplegable de posiciones.
// ---