// Datos de jugadores (igual que antes)
const allPlayers = [
    { id: 1, name: 'Portero 1', number: 1, position: 'GK', isStarter: true },
    { id: 4, name: 'Lateral Der. 1', number: 4, position: 'RB', isStarter: true },
    { id: 6, name: 'Defensa Cen. 1', number: 6, position: 'CB', isStarter: true },
    { id: 2, name: 'Defensa Cen. 2', number: 2, position: 'CB', isStarter: true },
    { id: 3, name: 'Lateral Izq. 1', number: 3, position: 'LB', isStarter: true },
    { id: 10, name: 'Mediocentro 1', number: 10, position: 'CM', isStarter: true },
    { id: 5, name: 'Interior Der. 1', number: 5, position: 'RM', isStarter: true },
    { id: 8, name: 'Interior Izq. 1', number: 8, position: 'LM', isStarter: true },
    { id: 7, name: 'Extremo 1', number: 7, position: 'LW', isStarter: true },
    { id: 9, name: 'Delantero 1', number: 9, position: 'ST', isStarter: true },
    { id: 11, name: 'Extremo 2', number: 11, position: 'RW', isStarter: true },
    // Suplentes
    { id: 12, name: 'Portero Sup.', number: 12, position: 'GK', isStarter: false },
    { id: 13, name: 'Defensa Sup. 1', number: 13, position: 'DF', isStarter: false },
    { id: 14, name: 'Medio Sup. 1', number: 14, position: 'MD', isStarter: false },
    { id: 15, name: 'Delantero Sup. 1', number: 15, position: 'FW', isStarter: false },
];

// Formaciones con posiciones X/Y en porcentajes del campo HORIZONTAL
// Tu portería a la IZQUIERDA (X bajo)
// X es horizontal (0=tu portería, 100=portería rival)
// Y es vertical (0=arriba de pantalla, 100=abajo de pantalla)
const formations = {
    "433": [
        { x: 5, y: 50, type: 'GK' }, // Portero (cerca de la izquierda, centrado vertical)
        { x: 22, y: 15, type: 'LB' }, // Lateral Izquierdo (derecha de GK, arriba)
        { x: 22, y: 37, type: 'CB' }, // Central 1 (derecha de GK, centrado-arriba)
        { x: 22, y: 60, type: 'CB' }, // Central 2 (derecha de GK, centrado-abajo)
        { x: 22, y: 85, type: 'RB' }, // Lateral Derecho (derecha de GK, abajo)
        { x: 40, y: 30, type: 'CM' }, // Mediocentro Izquierdo (medio campo, arriba)
        { x: 35, y: 50, type: 'DM' }, // Pivote/Mediocentro Defensivo (medio campo, centrado)
        { x: 40, y: 70, type: 'CM' }, // Mediocentro Derecho (medio campo, abajo)
        { x: 55, y: 18, type: 'LW' }, // Extremo Izquierdo (cerca de portería rival, arriba)
        { x: 60, y: 50, type: 'ST' }, // Delantero Centro (cerca de portería rival, centrado)
        { x: 55, y: 82, type: 'RW' }  // Extremo Derecho (cerca de portería rival, abajo)
    ],
    "442": [ // Adaptado para campo horizontal, tu portería a la izquierda
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
        { x: 60, y: 60, type: 'ST' }  // Delantero 2 (ataque, centrado-abajo)
    ],
    // Puedes añadir más formaciones aquí
};

let draggedPlayerElement = null;

function dragStart(event) {
    if (event.target.classList.contains('player')) {
        draggedPlayerElement = event.target;
        event.dataTransfer.setData('text/plain', draggedPlayerElement.dataset.playerId);
        // event.target.classList.add('dragging');
    } else {
         event.preventDefault();
    }
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (draggedPlayerElement && event.target.closest('.field')) {
        const field = event.target.closest('.field');
        const rect = field.getBoundingClientRect();
        // Calcular la posición X e Y del drop en porcentajes relativos al campo HORIZONTAL
        const x = ((event.clientX - rect.left) / rect.width) * 100; // X es horizontal
        const y = ((event.clientY - rect.top) / rect.height) * 100; // Y es vertical

        // Aplicar las coordenadas X e Y directamente a left y top en el campo horizontal
        draggedPlayerElement.style.left = `${x}%`;
        draggedPlayerElement.style.top = `${y}%`;

        // draggedPlayerElement.classList.remove('dragging');
        draggedPlayerElement = null;
    }
}

// Función para crear un elemento de jugador para el campo
function createFieldPlayerElement(player) {
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.textContent = player.number;
    playerElement.dataset.playerId = player.id;
    playerElement.setAttribute('draggable', true);
    playerElement.addEventListener('dragstart', dragStart);
    return playerElement;
}

// Función para crear una tarjeta de jugador para las listas
function createPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.dataset.playerId = player.id;
    playerCard.innerHTML = `
        <span>${player.number} - ${player.name}</span>
        <span style="font-size: 0.8em; color: #aaa; margin-left: auto;">${player.position}</span>
    `;
    // playerCard.setAttribute('draggable', true); // Para arrastrar desde la lista (futuro)
    // playerCard.addEventListener('dragstart', dragStartFromList); // (futuro)
    return playerCard;
}


function renderFormation(formationCode) {
    const fieldContainer = document.getElementById('players-container');
    fieldContainer.querySelectorAll('.player').forEach(p => p.remove());

    const titularesContainer = document.getElementById('starting-eleven');
    titularesContainer.innerHTML = '';

    const benchContainer = document.getElementById('bench');
    benchContainer.innerHTML = '';

    const formationSlots = formations[formationCode];
    const starters = allPlayers.filter(player => player.isStarter);
    const benchPlayers = allPlayers.filter(player => !player.isStarter);

    if (starters.length < formationSlots.length) {
        console.warn(`Advertencia: La formación ${formationCode} requiere ${formationSlots.length} titulares, pero solo hay ${starters.length}.`);
    }

    // Renderizar jugadores en el campo según los slots de la formación HORIZONTAL
    formationSlots.forEach((slot, index) => {
        const playerForSlot = starters[index];

        if (playerForSlot) {
            const playerElement = createFieldPlayerElement(playerForSlot);
            // Posicionar el elemento del jugador usando las coordenadas X/Y del slot
            // X -> left (horizontal en campo horizontal)
            // Y -> top (vertical en campo horizontal)
            playerElement.style.left = `${slot.x}%`;
            playerElement.style.top = `${slot.y}%`;
            fieldContainer.appendChild(playerElement);
        } else {
             console.warn(`No hay jugador titular disponible para el slot de la posición ${slot.type || 'Desconocida'} (${index + 1} de la formación ${formationCode}).`);
        }
    });

    // Renderizar las listas (sin cambios)
    starters.forEach(player => {
        const playerCard = createPlayerCard(player);
        titularesContainer.appendChild(playerCard);
    });

    benchPlayers.forEach(player => {
        const playerCard = createPlayerCard(player);
        benchContainer.appendChild(playerCard);
    });
}

const field = document.querySelector('.field');
field.addEventListener('dragover', dragOver);
field.addEventListener('drop', drop);

const formationSelect = document.getElementById('formation');
formationSelect.addEventListener('change', (e) => {
    renderFormation(e.target.value);
});

renderFormation(formationSelect.value);

// --- Funcionalidad adicional para futuro ---
// Arrastrar entre listas y campo requerirá adaptar la lógica de drop para los contenedores de listas
// y ajustar el estado isStarter de los jugadores.
// ---
