const API_URL = "http://localhost:8000/api";

document.addEventListener("DOMContentLoaded", () => {
  fetchTodos();
});

async function addTodo(event) {
  event.preventDefault();

  const taskInput = document.getElementById("todo-input");
  const task = taskInput.value.trim();

  if (!task) return;

  try {
    const res = await fetch(API_URL + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ task, done: false })  // Always false initially
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    taskInput.value = "";
    fetchTodos();
  } catch (error) {
    console.error("Failed to add todo:", error);
    alert("Failed to add ToDo. Check console for error.");
  }
}

async function fetchTodos() {
  try {
    const res = await fetch(API_URL + "/");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const todos = await res.json();
    console.log("Fetched todos:", todos);  // Debug log

    const list = document.getElementById("todo-list");
    list.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.task;
      if (todo.done) li.classList.add("done");

      const actions = document.createElement("div");
      actions.classList.add("todo-actions");

      // Edit button (pencil icon)
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.classList.add("edit");
      editBtn.onclick = () => {
        const newTask = prompt("Edit task:", todo.task);
        if (newTask && newTask.trim() !== "") {
          updateTodoText(todo.id, newTask.trim(), todo.done);
        }
      };

      // Done button
      const doneBtn = document.createElement("button");
      doneBtn.textContent = "✅";
      doneBtn.classList.add("done-btn");
      doneBtn.onclick = () => updateTodoStatus(todo.id, true);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => deleteTodo(todo.id);

      actions.appendChild(editBtn);
      actions.appendChild(doneBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(actions);

      list.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch todos:", error);
  }
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  fetchTodos();
}

async function updateTodoText(id, newTask, done) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: newTask, done: done })
  });
  fetchTodos();
}

async function updateTodoStatus(id, newStatus) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: newStatus })
  });
  fetchTodos();
}
