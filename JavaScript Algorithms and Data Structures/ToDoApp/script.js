// Obtain the task form element from the DOM by its ID.
const taskForm = document.getElementById("task-form");

// Get the confirmation dialog element for when the user attempts to close the form with unsaved changes.
const confirmCloseDialog = document.getElementById("confirm-close-dialog");

// Obtain the button for opening the task form.
const openTaskFormBtn = document.getElementById("open-task-form-btn");

// Get the button for closing the task form.
const closeTaskFormBtn = document.getElementById("close-task-form-btn");

// Button element for adding or updating a task.
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");

// Button to cancel the current action and close any open dialog.
const cancelBtn = document.getElementById("cancel-btn");

// Button to discard changes when closing the task form.
const discardBtn = document.getElementById("discard-btn");

// Container for displaying task cards.
const tasksContainer = document.getElementById("tasks-container");

// Input field for task title.
const titleInput = document.getElementById("title-input");

// Input field for task due date.
const dateInput = document.getElementById("date-input");

// Textarea for task description.
const descriptionInput = document.getElementById("description-input");

// Load task data from local storage or initialize it as an empty array if none exists.
const taskData = JSON.parse(localStorage.getItem("data")) || [];

// Variable to hold the currently selected task for editing.
let currentTask = {};

// Function to add a new task or update an existing one.
const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // Add new task to the beginning of the array or update the existing task.
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  // Save the updated task data to local storage.
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

// Function to refresh the display of tasks in the DOM.
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  // Generate HTML for each task and append to the container.
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
      <div class="task" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        <button onclick="editTask(this)" type="button" class="btn">Edit</button>
        <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
      </div>
    `;
  });
};

// Function to delete a task.
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

  // Remove the task from the DOM and the array.
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

// Function to edit a task.
const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

  currentTask = taskData[dataArrIndex];

  // Populate form inputs with the current task details.
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the task form for editing.
  taskForm.classList.toggle("hidden");  
};

// Function to reset the task form and hide it.
const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

// Populate the tasks container on initial load if there are saved tasks.
if (taskData.length) {
  updateTaskContainer();
}

// Event listener to toggle the task form's visibility.
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// Event listener to handle closing the task form, with checks for unsaved changes.
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

// Event listeners for canceling and discarding changes via the confirmation dialog.
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// Event listener to handle form submission, preventing default form submission and triggering task update or addition.
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});
