// Elimina la definici\u00F3n hardcodeada del array const allPlayers = [...]
// allPlayers ser\u00E1 llenado por la funci\u00F3n loadPlayersJson
let allPlayers = [];

// Definici\u00F3n de tus formaciones (esto se mantiene igual)
const formations = {
    "433": [
        // ... tus coordenadas para 433 en campo horizontal, tu porter\u00EDa a la izquierda ...
        { id: 'GK', x: 5, y: 50, type: 'POR' }, // A\u00F1adimos ID y cambiamos tipo a abreviatura
        { id: 'LB', x: 22, y: 15, type: 'LTI' }, // A\u00F1adimos ID y cambiamos tipo a abreviatura
        { id: 'LCB', x: 22, y: 37, type: 'DFC' }, // A\u00F1adimos ID y cambiamos tipo a abreviatura
        { id: 'RCB', x: 22, y: 60, type: 'DFC' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'RB', x: 22, y: 85, type: 'LTD' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'LCM', x: 40, y: 30, type: 'MC' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'CDM', x: 35, y: 50, type: 'MCD' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'RCM', x: 40, y: 70, type: 'MC' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'LW', x: 55, y: 18, type: 'EI' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura
        { id: 'ST', x: 60, y: 50, type: 'DEL' }, // A\u00Fñadimos ID y cambiamos tipo a abreviatura (cambiado de DL a DEL por consistencia)
        { id: 'RW', x: 55, y: 82, type: 'ED' } // A\u00Fñadimos ID y cambiamos tipo a abreviatura
    ],
    "442": [
        // ... tus coordenadas para 442 en campo horizontal, tu porter\u00EDa a la izquierda ...
        { id: 'GK', x: 5, y: 50, type: 'POR' },
        { id: 'LB', x: 22, y: 15, type: 'LTI' },
        { id: 'LCB', x: 22, y: 37, type: 'DFC' },
        { id: 'RCB', x: 22, y: 60, type: 'DFC' },
        { id: 'RB', x: 22, y: 85, type: 'LTD' },
        { id: 'LM', x: 40, y: 15, type: 'MEI' },
        { id: 'LCM', x: 40, y: 37, type: 'MC' },
        { id: 'RCM', x: 40, y: 60, type: 'MC' },
        { id: 'RM', x: 40, y: 85, type: 'MED' },
        { id: 'LST', x: 60, y: 37, type: 'DEL' }, // cambiado a DEL
        { id: 'RST', x: 60, y: 60, type: 'DEL' } // cambiado a DEL
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


// ** Funci\u00F3n para cargar los jugadores desde un archivo JSON (MODIFICADA) **
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
        // Ahora, todos los jugadores empiezan como suplentes (isStarter: false)
        // y a\u00Fñadimos assignedSlotIndex para rastrear d\u00F3nde est\u00E1n en el campo (si est\u00E1n)
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
                position: playerJson["Mejor Posición"]?.trim() || '', // Posici\u00F3n principal (puede usarse para el filtro del desplegable)
            
                // ** Todos los jugadores empiezan como suplentes **
                isStarter: false,
                assignedSlotIndex: null, // Nuevo: \u00CDndice del slot de formaci\u00F3n al que est\u00E1 asignado (null si est\u00E1 en lista)

                // ** Posiciones elegibles (eligiblePositions) **
                // Mapeamos "Mejor Posici\u00f3n" y "Posci\u00f3n Alterna" a las elegibles
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

            // A\u00Fñadimos "Posci\u00f3n Alterna" si existe y no est\u00E1 vac\u00EDa/repetida
            const altPos = playerJson["Posci\u00f3n Alterna"]?.trim();
            if (altPos && altPos !== '' && !player.eligiblePositions.includes(altPos)) {
                player.eligiblePositions.push(altPos);
            }

            return player; // Retornamos el objeto jugador mapeado
        }).filter(player => player !== null); // Filtramos cualquier entrada que retorn\u00F3 null


        // Validar si se cargaron jugadores v\u00E1lidos despu\u00E9s del mapeo/filtrado
         if (allPlayers.length === 0) {
             console.warn(`No se cargaron jugadores v\u00E1lidos despu\u00E9s del procesamiento de "${jsonFilePath}". Revisa el formato JSON y las claves esperadas.`);
             showErrorMessage(`Error en el formato de "${jsonFilePath}". Debe contener un array de jugadores.`);
             const formationSelect = document.getElementById('formation');
             if (formationSelect) { formationSelect.disabled = true; }
             return;
         }


        console.log('Jugadores cargados exitosamente desde JSON:', allPlayers);

        // --- Una vez que los jugadores est\u00E1n cargados, inicializa la UI ---
        // Renderiza la formaci\u00F3n inicial con espacios vac\u00EDos y todos al banquillo
        const formationSelect = document.getElementById('formation');
        if (formationSelect) {
            formationSelect.disabled = false; // Asegura que el selector est\u00E9 habilitado
            renderFormation(formationSelect.value); // Llama a renderFormation para mostrar espacios vac\u00EDos y suplentes
        }

    } catch (error) {
        console.error('Error inesperado al cargar o parsear el archivo JSON:', error);
        showErrorMessage(`Error interno al procesar el archivo "${jsonFilePath}". Aseg\u00FArate de que es un JSON v\u00E1lido.`);
    }
}

// --- Funci\u00F3n para crear un elemento que representa un espacio vac\u00EDo en el campo (NUEVO) ---
function createEmptySlotElement(slot, slotIndex) {
    const emptySlotElement = document.createElement('div');
    emptySlotElement.className = 'empty-slot'; // Clase CSS para darle estilo (necesitar\u00E1s definirla)
    emptySlotElement.textContent = slot.type; // Muestra la abreviatura de la posici\u00F3n
    emptySlotElement.dataset.slotIndex = slotIndex; // Guarda el \u00EDndice del slot
    // Posicionar el espacio vac\u00EDo usando las coordenadas X/Y del slot
    emptySlotElement.style.position = 'absolute'; // Esencial para posicionamiento X/Y
    emptySlotElement.style.left = `${slot.x}%`;
    emptySlotElement.style.top = `${slot.y}%`;
    // A\u00F1adir listeners de drag and drop para poder soltar jugadores aqu\u00ED
    emptySlotElement.addEventListener('dragover', dragOver);
    emptySlotElement.addEventListener('drop', drop);
    // Opcional: A\u00F1adir estilos b\u00E1sicos o clases para el hover/dragover visual en CSS
    // Centrar el contenido (el texto de la posici\u00F3n)
    emptySlotElement.style.display = 'flex';
    emptySlotElement.style.justifyContent = 'center';
    emptySlotElement.style.alignItems = 'center';
    // Centrar el elemento mismo en sus coordenadas X/Y
    emptySlotElement.style.transform = 'translate(-50%, -50%)';

    return emptySlotElement;
}


// --- Funci\u00F3n para crear un elemento de jugador para el campo (sin cambios) ---
function createFieldPlayerElement(player) {
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.textContent = player.number;
    playerElement.dataset.playerId = player.id; // Usamos el ID mapeado
    playerElement.setAttribute('draggable', true);
    playerElement.addEventListener('dragstart', dragStart);
    // Centrar el contenido (n\u00FAmero)
    playerElement.style.display = 'flex';
    playerElement.style.justifyContent = 'center';
    playerElement.style.alignItems = 'center';
    // Centrar el elemento mismo en sus coordenadas X/Y (si se posiciona absol\u00FAtamente)
    // Aseg\u00FArate de que tu CSS base para .player ya incluye transform: translate(-50%, -50%);
    return playerElement;
}

// --- Funci\u00F3n para crear una tarjeta de jugador para las listas (con listener de click y draggable) ---
function createPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.dataset.playerId = player.id; // Usamos el ID mapeado
    playerCard.innerHTML = `
        <span>${player.number} - ${player.name}</span>
        <span style="font-size: 0.8em; color: #aaa; margin-left: auto;">${player.position}</span>
    `;
    // Hacemos las tarjetas arrastrables
    playerCard.setAttribute('draggable', true);
    playerCard.addEventListener('dragstart', dragStart);

    // **Listener de click para mostrar posiciones elegibles**
    playerCard.addEventListener('click', (event) => {
        // Usamos showPositionDropdown (implementaci\u00F3n b\u00E1sica de desplegable)
        showPositionDropdown(player, event);
    });

    return playerCard;
}

// --- Funci\u00F3n renderFormation (MODIFICADA SIGNIFICATIVAMENTE) ---
function renderFormation(formationCode) {
    // Solo renderiza si allPlayers ha sido llenado y no está vacío
    if (!allPlayers || allPlayers.length === 0) {
        console.warn("allPlayers está vacío. No se puede renderizar la formación.");
        return;
    }

    const fieldContainer = document.getElementById('players-container');
    const titularesContainer = document.getElementById('starting-eleven');
    const benchContainer = document.getElementById('bench');
    
    // Limpiar solo los elementos dinámicos (jugadores y espacios vacíos) del campo
    fieldContainer.querySelectorAll('.player, .empty-slot').forEach(el => el.remove());
    
    // Limpiar las listas
    titularesContainer.innerHTML = '';
    benchContainer.innerHTML = '';

    const formationSlots = formations[formationCode];
    
    // Filtrar jugadores por su estado actual
    const playersInField = allPlayers.filter(player => player.isStarter && player.assignedSlotIndex !== null);
    const benchPlayers = allPlayers.filter(player => !player.isStarter || player.assignedSlotIndex === null); // Los que no son titulares O no est\u00E1n asignados a un slot van al banquillo

    // --- Renderizar ESPACIOS VACÍOS o JUGADORES en el campo ---
    // Iteramos sobre los slots de la formaci\u00F3n
    formationSlots.forEach((slot, index) => {
        // Buscamos si alg\u00FAn jugador est\u00E1 asignado a este slot (tiene isStarter: true y assignedSlotIndex == index)
        const playerInSlot = playersInField.find(player => player.assignedSlotIndex === index);

        if (playerInSlot) {
             // Si hay un jugador asignado a este slot, creamos y a\u00F1adimos la ficha del jugador
             const playerElement = createFieldPlayerElement(playerInSlot);
             // Posicionamos usando las coordenadas del slot asignado
             playerElement.style.left = `${slot.x}%`;
             playerElement.style.top = `${slot.y}%`;
             fieldContainer.appendChild(playerElement);
        } else {
             // Si no hay jugador asignado a este slot, creamos y a\u00F1adimos un espacio vac\u00EDo
             const emptySlotElement = createEmptySlotElement(slot, index); // Creamos el nuevo elemento de espacio vac\u00EDo
             fieldContainer.appendChild(emptySlotElement); // Lo a\u00F1adimos al campo
        }
    });


    // --- Renderizar JUGADORES en las listas ---

    // 1. Renderizar jugadores en la lista de TITULARES
    // Ordenar los jugadores en el campo por su slot index para mostrarlos en orden de formaci\u00F3n en la lista
    const sortedStarters = playersInField.sort((a, b) => a.assignedSlotIndex - b.assignedSlotIndex);
    sortedStarters.forEach(player => {
        const playerCard = createPlayerCard(player); // Crea la tarjeta
        titularesContainer.appendChild(playerCard); // La a\u00F1ade a la lista de titulares
    });


    // 2. Renderizar jugadores en la lista de SUPLENTES
    // Puedes ordenar la lista de suplentes aqu\u00ED si quieres (ej: por n\u00FAmero, apellido, etc.)
    // benchPlayers.sort((a, b) => a.number - b.number); // Ejemplo de orden por n\u00FAmero
    benchPlayers.forEach(player => {
        const playerCard = createPlayerCard(player); // Crea la tarjeta
        benchContainer.appendChild(playerCard); // La a\u00F1ade a la lista de suplentes
    });
}

// --- Funciones de Drag and Drop (MODIFICADAS) ---
let draggedPlayerId = null; // Almacenar solo el ID del jugador arrastrado

function dragStart(event) {
    const targetElement = event.target;

    // Solo permitir drag si es un elemento con la clase 'player' (campo) o 'player-card' (lista)
    if (targetElement.classList.contains('player') || targetElement.classList.contains('player-card')) {
        draggedPlayerId = targetElement.dataset.playerId;
        event.dataTransfer.setData('text/plain', draggedPlayerId);
        event.dataTransfer.effectAllowed = 'move';

        setTimeout(() => {
             targetElement.classList.add('dragging');
        }, 0);

    } else {
        event.preventDefault();
    }
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    // Identificar la zona de soltado de inter\u00E9s: espacios vac\u00EDos, jugadores en campo, lista de suplentes
    const dropZone = event.target.closest('.empty-slot, .player, #bench');


     // Limpiar clases de dragover previas en todas las zonas posibles de inter\u00E9s
     document.querySelectorAll('.empty-slot, .player, #bench').forEach(el => el.classList.remove('drag-over'));


    // A\u00Fñadir clase si la zona de soltado es v\u00E1lida
    if (dropZone) {
        // Podemos refinar qu\u00E9 zonas se resaltan dependiendo del elemento arrastrado si queremos.
        // Por ahora, resaltamos cualquier zona potencial de soltado (espacio vac\u00EDo, jugador en campo, banquillo).
        dropZone.classList.add('drag-over');
    }
}

function drop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Limpiar clases de dragover de todas las zonas
    document.querySelectorAll('.empty-slot, .player, .player-card, .field, #starting-eleven, #bench').forEach(el => el.classList.remove('drag-over'));
    
    const droppedPlayerId = event.dataTransfer.getData('text/plain');
    const draggedPlayer = allPlayers.find(p => String(p.id) === droppedPlayerId);
    if (!draggedPlayer) {
        console.warn("No se encontró el jugador arrastrado (ID:", droppedPlayerId, ").");
        // Eliminar la clase 'dragging' por si acaso el elemento a\u00FAn la tiene
        const draggedElement = document.querySelector(`.player[data-player-id="${droppedPlayerId}"], .player-card[data-player-id="${droppedPlayerId}"]`);
         if (draggedElement) {
             draggedElement.classList.remove('dragging');
         }
        return;
    }
    
    // Eliminar la clase 'dragging' del elemento que se arrastró
    const draggedElement = document.querySelector(`.player[data-player-id="${droppedPlayerId}"], .player-card[data-player-id="${droppedPlayerId}"]`);
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    
    // Encontrar el elemento más específico donde se soltó que sea un target v\u00E1lido
    const dropTargetElement = event.target.closest('.empty-slot, .player, #bench'); // Los targets v\u00E1lidos son empty-slot, player, bench


    // --- Lógica de soltar e intercambiar/mover ---

    // Soltar sobre un ESPACIO VAC\u00CDO en el campo (.empty-slot)
    if (dropTargetElement && dropTargetElement.classList.contains('empty-slot')) {
        const targetSlotIndex = parseInt(dropTargetElement.dataset.slotIndex);

        // Asegurarse de que el jugador arrastrado es un suplente (no est\u00E1 ya en el campo)
        if (!draggedPlayer.isStarter) {
             console.log(`Colocando a ${draggedPlayer.name} en el slot vac\u00EDo (Slot ${targetSlotIndex}).`);

             // 1. Actualizar el estado del jugador arrastrado en el array allPlayers
             draggedPlayer.isStarter = true; // Ahora es titular
             draggedPlayer.assignedSlotIndex = targetSlotIndex; // Asignar al slot del campo

             // 2. Re-renderizar TODO (campo y listas) para reflejar el cambio de estado
             renderFormation(document.getElementById('formation').value);

        } else {
            console.log(`Jugador ${draggedPlayer.name} ya es titular. No se puede soltar en espacio vac\u00EDo.`);
            // Puedes a\u00F1adir feedback visual aqu\u00ED (ej: sacudir el slot, mensaje)
        }

    }
    // Soltar sobre un JUGADOR que YA EST\u00C1 EN EL CAMPO (.player)
    else if (dropTargetElement && dropTargetElement.classList.contains('player')) {
        const targetPlayerId = dropTargetElement.dataset.playerId;
        const targetPlayer = allPlayers.find(p => String(p.id) === targetPlayerId);

        // Asegurarse de que los jugadores son diferentes
        if (targetPlayer && draggedPlayer.id !== targetPlayer.id) {
             console.log(`Intentando intercambiar ${draggedPlayer.name} con ${targetPlayer.name} (en campo).`);

             // Caso 1: Arrastrar SUPLENTE sobre TITULAR en campo (Intercambio: Suplente al campo, Titular al banco)
             if (!draggedPlayer.isStarter && targetPlayer.isStarter) {
                 console.log(`  Suplente ${draggedPlayer.name} entra por Titular ${targetPlayer.name}.`);

                 const targetSlotIndex = targetPlayer.assignedSlotIndex; // Slot actual del titular

                 // 1. Actualizar estado en allPlayers
                 draggedPlayer.isStarter = true;
                 draggedPlayer.assignedSlotIndex = targetSlotIndex; // El suplente ocupa el slot del titular

                 targetPlayer.isStarter = false;
                 targetPlayer.assignedSlotIndex = null; // El titular va al banco

                 // 2. Re-renderizar TODO (campo y listas) para reflejar los cambios de estado
                 renderFormation(document.getElementById('formation').value);

             }
             // Caso 2: Arrastrar TITULAR sobre otro TITULAR en campo (Intercambio de posici\u00F3n en el campo)
             else if (draggedPlayer.isStarter && targetPlayer.isStarter) {
                  console.log(`  Titular ${draggedPlayer.name} intercambia posici\u00F3n con Titular ${targetPlayer.name}.`);

                  // Intercambiar los assignedSlotIndex en los datos
                  const draggedOriginalSlotIndex = draggedPlayer.assignedSlotIndex;
                  const targetOriginalSlotIndex = targetPlayer.assignedSlotIndex;

                  draggedPlayer.assignedSlotIndex = targetOriginalSlotIndex;
                  targetPlayer.assignedSlotIndex = draggedOriginalSlotIndex;

                  // Re-renderizar TODO (campo y listas) para reflejar los cambios de estado
                  renderFormation(document.getElementById('formation').value);

             }
             // Caso 3: Arrastrar TITULAR sobre SUPLENTE en campo (No deber\u00EDa ocurrir con el flujo actual de empty-slots)
             // ... (Si implementas la l\u00F3gica de soltar sobre tarjeta en lista de titulares, ir\u00EDa ah\u00ED) ...

        } else if (targetPlayer && draggedPlayer.id === targetPlayer.id) {
             console.log("Arrastrado y soltado sobre el mismo jugador en el campo. (No hace nada)");
        } else {
             console.warn("Target de soltado no encontrado o inv\u00E1lido (jugador en campo).");
        }
    }
    // Soltar sobre la lista de SUPLENTES (\#bench) - Para enviar un jugador del campo al banco
    else if (dropTargetElement && dropTargetElement.id === 'bench') {
        // Asegurarse de que el jugador arrastrado es un titular (est\u00E1 en el campo)
        if (draggedPlayer.isStarter) {
             console.log(`Enviando a ${draggedPlayer.name} al banco.`);

             // 1. Actualizar el estado del jugador arrastrado en el array allPlayers
             draggedPlayer.isStarter = false; // Pasa a ser suplente
             draggedPlayer.assignedSlotIndex = null; // Ya no est\u00E1 asignado a un slot

             // 2. Re-renderizar TODO (campo y listas) para reflejar los cambios de estado
             renderFormation(document.getElementById('formation').value);

        } else {
            console.log(`Jugador ${draggedPlayer.name} ya es suplente. Soltado en lista de suplentes.`);
            // Ya era suplente, no hace falta cambiar nada.
             // Si quisieras cambiar el orden en la lista, necesitar\u00EDas l\u00F3gica adicional aqu\u00ED.
        }
    }
     // Soltar sobre el CAMPO (\#players-container) - Cuando no se suelta sobre un empty-slot o player espec\u00EDfico
     // Este caso puede ocurrir si sueltas un jugador TITULAR en una parte vac\u00EDa del campo
     // Mantenemos la l\u00F3gica b\u00E1sica de reposicionar visualmente (pero renderFormation lo anular\u00E1 al re-renderizar)
    //  else if (dropTargetElement && dropTargetElement.id === 'players-container') {
    //       console.log(`Soltado sobre el contenedor del campo (${draggedPlayer.name}).`);
    //       // Si el jugador arrastrado es TITULAR y lo soltamos en una zona vac\u00EDa del campo
    //       if (draggedPlayer.isStarter) {
    //           // Nota: Con re-renderFormation, este bloque de actualizaci\u00F3n visual directa
    //           // probablemente ya no es necesario, ya que renderFormation redibujar\u00E1 la posici\u00F3n
    //           // si assignedSlotIndex es null (lo pondr\u00E1 en el primer slot libre si lo hay).
    //           // Si quieres poder "mover libremente" titulares en el campo, necesitar\u00EDas guardar
    //           // sus coordenadas X/Y directamente en el objeto jugador y usar esas coordenadas
    //           // en renderFormation cuando assignedSlotIndex sea null.
    //            console.log("Reposicionamiento libre de titulares no implementado con re-render.");
    //       } else {
    //           console.warn(`Suplente ${draggedPlayer.name} soltado en contenedor del campo sin target v\u00E1lido.`);
    //       }
    //  }
     // Soltar sobre una TARJETA de JUGADOR en la lista de TITULARES (\#starting-eleven .player-card)
     // Esta l\u00F3gica de intercambio con la lista de titulares necesitar\u00EDa ser implementada aqu\u00ED.
     // Ser\u00EDa similar al intercambio de suplente con titular en campo, pero moviendo tarjetas en las listas.


    draggedPlayerId = null; // Limpiar el ID del jugador arrastrado
}


// --- Funci\u00F3n para gestionar la visibilidad del men\u00FA desplegable de posiciones ---
let currentDropdown = null; // Variable para seguir el men\u00FA desplegable abierto

function showPositionDropdown(player, event) {
    // Si ya hay un desplegable abierto, lo cerramos
    if (currentDropdown) {
        currentDropdown.remove();
        currentDropdown = null;
         // Si el click es sobre el mismo jugador que ten\u00EDa el desplegable abierto, solo cerramos
         // (Verificamos por player ID asociado al dropdown)
        if (currentDropdown && currentDropdown.dataset.playerId === String(player.id)) {
             // No hacemos nada m\u00E1s, ya se cerr\u00F3 arriba
             document.removeEventListener('click', handleClickOutsideDropdown, true); // Pasa true
             return;
         }
    }

    const playerCard = event.target.closest('.player-card'); // Obtiene la tarjeta en la que se hizo clic
    if (!playerCard) return; // Salir si no se hizo clic en una tarjeta


    // S\u00f3lo mostrar el desplegable si hay posiciones elegibles definidas
    if (!player.eligiblePositions || player.eligiblePositions.length === 0) {
        console.warn(`No hay posiciones elegibles definidas para ${player.name}. No se mostrar\u00E1 el desplegable.`);
        return; // No mostrar desplegable si no hay posiciones
    }


    const dropdown = document.createElement('div');
    dropdown.className = 'position-dropdown'; // Clase para darle estilo al desplegable
    dropdown.dataset.playerId = player.id; // Para saber de qu\u00E9 jugador es este desplegable

    // A\u00Fñadir estilos b\u00E1sicos al desplegable para que aparezca cerca de la tarjeta
    // Obtenemos la posici\u00F3n de la tarjeta relativa a la ventana
    const rect = playerCard.getBoundingClientRect();
    dropdown.style.position = 'fixed'; // Usar fixed para posicionar respecto a la ventana
    dropdown.style.backgroundColor = '#333';
    dropdown.style.border = '1px solid #555';
    dropdown.style.borderRadius = '5px';
    dropdown.style.zIndex = 10; // Para que aparezca por encima de otros elementos
    dropdown.style.minWidth = `${playerCard.offsetWidth}px`; // Mismo ancho que la tarjeta
    dropdown.style.padding = '5px 0';
    // Posiciona justo debajo de la tarjeta
    dropdown.style.top = `${rect.bottom + 5}px`; // 5px de margen debajo de la tarjeta
    // Alinea a la izquierda de la tarjeta
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.5)';
    dropdown.style.maxHeight = '200px'; // Altura m\u00E1xima
    dropdown.style.overflowY = 'auto'; // Scroll si hay muchas posiciones


    // Llenar el desplegable con las posiciones elegibles
    player.eligiblePositions.forEach(position => {
        const positionItem = document.createElement('div');
        positionItem.className = 'position-item'; // Clase para darle estilo al men\u00FA
        positionItem.textContent = position;
        positionItem.style.padding = '8px 15px';
        positionItem.style.cursor = 'pointer';
        positionItem.style.color = '#ccc';

        // Estilo al pasar el mouse
        positionItem.onmouseover = () => { positionItem.style.backgroundColor = '#555'; };
        positionItem.onmouseout = () => { positionItem.style.backgroundColor = 'transparent'; };

        // Evento click para seleccionar la posici\u00F3n
        positionItem.onclick = () => {
             console.log(`Posici\u00F3n "${position}" seleccionada para ${player.name}`);

             // 1. Actualizar la posici\u00F3n principal del jugador en el array allPlayers
             player.position = position;

             // 2. Actualizar visualmente solo el texto de la posici\u00F3n en la tarjeta
             const titularesContainer = document.getElementById('starting-eleven');
             const benchContainer = document.getElementById('bench');

             // Encontrar la tarjeta espec\u00EDfica que cambi\u00F3
             const playerCards = [...titularesContainer.querySelectorAll('.player-card'),
                               ...benchContainer.querySelectorAll('.player-card')];

             const cardToUpdate = playerCards.find(card =>
                 card.dataset.playerId === String(player.id));

             if (cardToUpdate) {
                 // Buscar el span de la posici\u00F3n dentro de la tarjeta y actualizar solo su texto
                 const positionSpan = cardToUpdate.querySelector('span:last-child'); // Selecciona el \u00FAltimo span

                 if (positionSpan) {
                     positionSpan.textContent = player.position; // Actualiza solo el texto de la posici\u00F3n
                 } else {
                     console.warn(`No se encontr\u00F3 el span de posici\u00F3n dentro de la tarjeta del jugador ${player.id}`);
                 }
             }


             // 3. Cerrar el desplegable
             dropdown.remove();
             currentDropdown = null;
             document.removeEventListener('click', handleClickOutsideDropdown, true); // Elimina el listener al cerrar
        };

        dropdown.appendChild(positionItem);
    });


    // A\u00Fñadir el desplegable al cuerpo del documento
    document.body.appendChild(dropdown);
    currentDropdown = dropdown;


    // A\u00Fñadir listener para cerrar el desplegable si se hace clic fuera
    // Usamos capture: true para que este listener se ejecute antes que otros posibles listeners de click
    document.addEventListener('click', handleClickOutsideDropdown, true);

}

function handleClickOutsideDropdown(event) {
    // Verifica si se hizo clic fuera del desplegable actual Y fuera de la tarjeta que lo abri\u00F3
    const playerCardClicked = event.target.closest('.player-card');
    if (currentDropdown && !currentDropdown.contains(event.target) && (!playerCardClicked || playerCardClicked.dataset.playerId !== currentDropdown.dataset.playerId) ) {

        // A\u00Fñadimos una peque\u00F1a demora para evitar problemas si el click que abri\u00F3 este
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
loadPlayersJson('players.json');

// A\u00Fñade event listeners para Drag and Drop en el campo
const field = document.querySelector('.field');
if (field) {
    field.addEventListener('dragover', dragOver);
    field.addEventListener('drop', drop);
} else {
    console.error("Elemento con clase '.field' no encontrado.");
}

// A\u00Fñade event listeners para Drag and Drop en las listas de jugadores
const startingElevenContainer = document.getElementById('starting-eleven');
const benchContainer = document.getElementById('bench');

if (startingElevenContainer) {
    startingElevenContainer.addEventListener('dragover', dragOver);
    // No permitimos soltar directamente en la lista de titulares para este flujo (si todos empiezan en banquillo)
    // startingElevenContainer.addEventListener('drop', drop); // Comentamos esto si solo queremos arrastrar desde aqu\u00ED
} else {
     console.error("Elemento con ID 'starting-eleven' no encontrado.");
}

if (benchContainer) {
    benchContainer.addEventListener('dragover', dragOver);
    benchContainer.addEventListener('drop', drop); // Permitimos soltar en el contenedor de suplentes (para enviar del campo al banco)
} else {
     console.error("Elemento con ID 'bench' no encontrado.");
}


// A\u00Fñade event listener para el selector de formaci\u00F3n
const formationSelect = document.getElementById('formation');
if (formationSelect) {
    formationSelect.addEventListener('change', (e) => {
        renderFormation(e.target.value);
    });
} else {
     console.error("Elemento con ID 'formation' no encontrado.");
}