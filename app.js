let tasks = [];

// Funzione per aggiornare la Dashboard
function updateDashboard() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    const highPriorityCount = tasks.filter(task => task.priority === 'Alta').length;

    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('high-priority-count').textContent = highPriorityCount;
}

// Funzione per ordinare le attività
document.getElementById('sort-by').addEventListener('change', function () {
    const sortBy = this.value;
    if (sortBy === 'date') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
        tasks.sort((a, b) => a.priority.localeCompare(b.priority));
    } else if (sortBy === 'completed') {
        tasks.sort((a, b) => a.completed - b.completed);
    }
    renderTasks();
});

// Funzione per aggiungere un'attività
document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const duration = document.getElementById('duration').value;
    const category = document.getElementById('category').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    const task = {
        name,
        description,
        duration,
        category,
        dueDate,
        priority,
        completed: false,
        timer: 0
    };

    tasks.push(task);
    renderTasks();
    updateDashboard();
    document.getElementById('todo-form').reset();
});

// Funzione per visualizzare le attività
function renderTasks() {
    const filteredTasks = filterTasks();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div><strong>${task.name}</strong> (${task.priority})</div>
            <p>${task.description}</p>
            <p>Durata: ${task.duration} ore</p>
            <p>Categoria: ${task.category}</p>
            <p>Data di scadenza: ${task.dueDate}</p>
            <button onclick="toggleCompletion(${index})">${task.completed ? 'Segna come incompleta' : 'Segna come completata'}</button>
            <button onclick="deleteTask(${index})">Elimina</button>
            <button onclick="startTimer(${index})">${task.timer === 0 ? 'Inizia cronometro' : 'Ferma cronometro'}</button>
            <p>Tempo tracciato: ${task.timer}s</p>
        `;
        todoList.appendChild(li);
    });
}

// Funzione per filtrare le attività
function filterTasks() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const priorityFilter = document.getElementById('priority-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;

    return tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        const matchesCategory = !categoryFilter || task.category === categoryFilter;

        return matchesSearch && matchesPriority && matchesCategory;
    });
}

// Funzione per eliminare un'attività
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    updateDashboard();
}

// Funzione per segnare un'attività come completata/incompleta
function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    updateDashboard();
}

// Funzione per avviare il cronometro
function startTimer(index) {
    const task = tasks[index];
    if (task.timer === 0) {
        task.timerStartTime = Date.now();
        task.timerInterval = setInterval(() => {
            task.timer = Math.floor((Date.now() - task.timerStartTime) / 1000);
            renderTasks();
        }, 1000);
    } else {
        clearInterval(task.timerInterval);
        task.timer = 0;
        renderTasks();
    }
}

// Funzione per scaricare il report
document.getElementById('download-report').addEventListener('click', function() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.json';
    link.click();
});

// Funzione per la stampa
document.getElementById('print-preview').addEventListener('click', function() {
    window.print();
});

// Carica inizialmente
renderTasks();
updateDashboard();
