// --- 0. Lógica de Navegación de Pestañas ---
// Asegura que el diseño Neumorphic se vea al cambiar de sección
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

        const targetTab = button.dataset.tab;
        const targetElement = document.getElementById(targetTab);
        if (targetElement) {
            targetElement.classList.add('active');
            button.classList.add('active');
        }
    });
});

// --- 1. PROCESO [C]: Tareas con Prioridad (PRIORIDAD 1) ---
let tasks = JSON.parse(localStorage.getItem('simpleScrumTasks')) || [];

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return; 
    taskList.innerHTML = ''; 

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-list">No hay tareas aún.</li>';
    } else {
        tasks.forEach((task, index) => {
            // PARCHE DE SEGURIDAD: Si la tarea es vieja (solo texto), le asignamos prioridad Baja
            const text = typeof task === 'string' ? task : task.text;
            const priority = task.priority || 'Baja';

            const li = document.createElement('li');
            li.className = `task-item priority-${priority.toLowerCase()}`;
            li.innerHTML = `
                <span><strong>[${priority}]</strong> ${text}</span>
                <button class="delete-button neumorphic-button-small" onclick="deleteTask(${index})">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    }
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    
    if (!taskInput || taskInput.value.trim() === "") return;

    const newTask = {
        text: taskInput.value.trim(),
        priority: priorityInput.value
    };

    tasks.push(newTask);
    localStorage.setItem('simpleScrumTasks', JSON.stringify(tasks));
    taskInput.value = ''; 
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('simpleScrumTasks', JSON.stringify(tasks));
    renderTasks();
}

// --- 2. PROCESO [B]: Convertidor (API) ---
async function convertCurrency() {
    const amount = document.getElementById('usdInput').value;
    const resultDisplay = document.getElementById('conversionResult');

    if (!amount) {
        resultDisplay.textContent = "Ingresa un monto.";
        return;
    }

    resultDisplay.textContent = "Cargando...";
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        const rate = data.rates.EUR;
        const converted = (parseFloat(amount) * rate).toFixed(2);
        resultDisplay.textContent = `${amount} USD = ${converted} EUR`;
        resultDisplay.style.color = '#27ae60';
    } catch (error) {
        resultDisplay.textContent = "Error de conexión.";
        resultDisplay.style.color = '#e74c3c';
    }
}

// --- 3. PROCESO [A]: Reloj Mundial ---
function updateClock() {
    const timeDisplay = document.getElementById('currentTime');
    const dateDisplay = document.getElementById('currentDate');
    if (!timeDisplay || !dateDisplay) return;

    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString();
    dateDisplay.textContent = now.toLocaleDateString();
}
setInterval(updateClock, 1000);
updateClock();

// --- 4. PROCESO [D]: Frases ---
const quotes = [
    "Prioriza C-B-A-D para el éxito.",
    "El equipo de 4 integrantes es imparable.",
    "GitHub es nuestro mejor aliado.",
    "Scrum: Falla rápido, aprende más rápido."
];

function generateQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!quoteDisplay) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = `"${quotes[randomIndex]}"`;
}

// Carga inicial
renderTasks();