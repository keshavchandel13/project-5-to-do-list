const inputBox = document.getElementById("input-box");
const prioritySelect = document.getElementById("priority-select");
const listContainer = document.getElementById("list-container");
const taskCount = document.getElementById("task-count");

// State Management
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addtask() {
    if (inputBox.value.trim() === '') {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: inputBox.value,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(task);
    inputBox.value = '';
    renderTasks();
    saveData();
}

function renderTasks(filter = 'all') {
    listContainer.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `priority-${task.priority} ${task.completed ? 'checked' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">${task.text}</span>
            <span class="close-btn" onclick="deleteTask(${task.id})">\u00d7</span>
        `;
        listContainer.appendChild(li);
    });

    updateStats();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTasks();
    saveData();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    saveData();
}

function updateStats() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCount.innerText = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
}

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        renderTasks(e.target.dataset.filter);
    });
});

// Initialization
document.getElementById('date-display').innerText = new Date().toDateString();
renderTasks();