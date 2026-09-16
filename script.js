// ===============================
// Task Manager – Equipo 1
// ===============================

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');

let tasks = [];
let taskIdCounter = 0;

// ---------- US01: Crear tarea ----------
function addTask() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('No se permiten tareas vacías');
        return;
    }

    const task = {
        id: ++taskIdCounter,
        text: text,
        completed: false
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
}

// ---------- US02: Mostrar tareas ----------
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        // Checkbox (US03)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Texto
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // Botón Editar (CR-001)
        const editBtn = document.createElement('button');
        editBtn.className = 'btn edit-btn';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => startEdit(task.id, li, span));

        // Botón Eliminar (US04)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateCounter();
}

// ---------- US03: Completar tarea ----------
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// ---------- US04: Eliminar tarea ----------
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

// ---------- US05: Contador ----------
function updateCounter() {
    const pending = tasks.filter(t => !t.completed).length;
    counter.textContent = `Tareas pendientes: ${pending}`;
}

// ---------- CR-001: Editar tarea ----------
function startEdit(id, li, span) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Reemplazar span por input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;

    li.replaceChild(input, span);
    input.focus();

    // Botones guardar/cancelar
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn save-btn';
    saveBtn.textContent = 'Guardar';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn cancel-btn';
    cancelBtn.textContent = 'Cancelar';

    li.replaceChild(saveBtn, editBtn);
    li.replaceChild(cancelBtn, deleteBtn);

    const finishEdit = (save) => {
        if (save) {
            const newText = input.value.trim();
            if (newText !== '') {
                task.text = newText;
            }
        }
        renderTasks();
    };

    saveBtn.addEventListener('click', () => finishEdit(true));
    cancelBtn.addEventListener('click', () => finishEdit(false));

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit(true);
        if (e.key === 'Escape') finishEdit(false);
    });
}

// ---------- Eventos ----------
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

// ---------- Inicialización ----------
renderTasks();