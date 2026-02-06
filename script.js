// --- Lógica de Navegación de Pestañas ---
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

        const targetTab = button.dataset.tab;
        document.getElementById(targetTab).classList.add('active');
        button.classList.add('active');
    });
});

// --- 1. Reloj Mundial (Actualización Automática) ---
function updateClock() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
    document.getElementById('currentDate').textContent = now.toLocaleDateString();
}
setInterval(updateClock, 1000); // Actualiza cada segundo
updateClock(); // Llama una vez para mostrarlo inmediatamente

// --- 2. Convertidor de Divisas (USD a EUR usando API) ---
document.getElementById('convertButton').addEventListener('click', async () => {
    const amount = document.getElementById('usdInput').value;
    const resultDisplay = document.getElementById('conversionResult');

    if (amount === "" || isNaN(amount)) {
        resultDisplay.textContent = "Por favor, ingresa un número válido.";
        resultDisplay.style.color = '#e74c3c';
        return;
    }

    resultDisplay.textContent = "Cargando...";
    resultDisplay.style.color = '#3498db';

    try {
        // Cómo se integra la API:
        // 1. Hacemos una petición a la API de tasas de cambio (gratuita).
        // 2. Esperamos la respuesta.
        // 3. Convertimos la respuesta a formato JSON.
        // 4. Extraemos la tasa de EUR.
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        const eurRate = data.rates.EUR; // Tasa de USD a EUR

        const convertedAmount = (parseFloat(amount) * eurRate).toFixed(2);
        resultDisplay.textContent = `${amount} USD = ${convertedAmount} EUR`;
        resultDisplay.style.color = '#27ae60';

    } catch (error) {
        // Manejo de errores si la API falla
        resultDisplay.textContent = "Error al obtener la tasa de cambio. Intenta de nuevo más tarde.";
        resultDisplay.style.color = '#e74c3c';
    }
});

// --- 3. Lista de Tareas (Product Backlog con LocalStorage) ---
let tasks = JSON.parse(localStorage.getItem('simpleScrumTasks')) || [];

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Limpia la lista antes de redibujar

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-list">No hay tareas aún. ¡Añade una!</li>';
    } else {
        tasks.forEach((taskText, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-button neumorphic-button-small" data-index="${index}">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    }

    // Añade el evento de click a los nuevos botones de eliminar
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const indexToDelete = event.target.dataset.index;
            tasks.splice(indexToDelete, 1); // Elimina la tarea del array
            localStorage.setItem('simpleScrumTasks', JSON.stringify(tasks)); // Actualiza LocalStorage
            renderTasks(); // Vuelve a dibujar la lista
        });
    });
}

document.getElementById('addTaskButton').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        tasks.push(taskText); // Añade la tarea al array
        localStorage.setItem('simpleScrumTasks', JSON.stringify(tasks)); // Guarda en LocalStorage
        taskInput.value = ''; // Limpia el input
        renderTasks(); // Redibuja la lista
    }
});

renderTasks(); // Carga las tareas al iniciar la página

// --- 4. Generador de Frases Motivacionales ---
const quotes = [
    "No te detengas hasta que te sientas orgulloso.",
    "El único modo de hacer un gran trabajo es amar lo que haces.",
    "Si puedes soñarlo, puedes lograrlo.",
    "Cada día es una nueva oportunidad para cambiar tu vida.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "La acción es la clave fundamental de todo éxito.",
    "No busques el éxito, sé el éxito."
];

document.getElementById('newQuoteButton').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quoteDisplay').textContent = quotes[randomIndex];
});