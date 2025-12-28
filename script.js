/* ===============================
   Load tasks from Local Storage
   =============================== */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* ===============================
   Get required DOM elements
   =============================== */
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

/* ===============================
   Form submit event
   =============================== */
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTask();
});

/* ===============================
   Add new task
   =============================== */
function addTask() {
  const newTask = {
    id: Date.now(),
    title: title.value.trim(),
    description: description.value.trim(),
    dueDate: dueDate.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToLocalStorage();
  taskForm.reset();
  displayTasks();
}

/* ===============================
   Display tasks on UI
   =============================== */
function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const listItem = document.createElement("li");
    listItem.className = task.completed ? "completed" : "";

    listItem.innerHTML = `
            <strong>${task.title}</strong><br>
            ${task.description}<br>
            <small>Due Date: ${task.dueDate}</small><br>

            <button onclick="toggleTaskStatus(${task.id})">✔</button>
            <button onclick="editTask(${task.id})">✏</button>
            <button onclick="removeTask(${task.id})">🗑</button>
        `;

    taskList.appendChild(listItem);
  });
}

/* ===============================
   Mark task complete / incomplete
   =============================== */
function toggleTaskStatus(taskId) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasksToLocalStorage();
  displayTasks();
}

/* ===============================
   Delete task
   =============================== */
function removeTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasksToLocalStorage();
  displayTasks();
}

/* ===============================
   Edit task
   =============================== */
function editTask(taskId) {
  const taskToEdit = tasks.find(task => task.id === taskId);

  title.value = taskToEdit.title;
  description.value = taskToEdit.description;
  dueDate.value = taskToEdit.dueDate;

  removeTask(taskId);
}

/* ===============================
   Filter tasks
   =============================== */
function filterTasks(type) {
  currentFilter = type;
  displayTasks();
}

/* ===============================
   Save tasks to Local Storage
   =============================== */
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ===============================
   Deadline Reminder
   =============================== */
function checkTaskDeadlines() {
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(task => {
    if (!task.completed && task.dueDate === today) {
      alert(`Reminder: "${task.title}" is due today!`);
    }
  });
}

/* Check reminder every 1 minute */
setInterval(checkTaskDeadlines, 60000);

/* Initial render */
displayTasks();
