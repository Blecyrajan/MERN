import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // READ: load tasks
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // CREATE: add task
  const addTask = async () => {
    if (!task.trim()) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task,
        completed: false
      })
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask("");
  };

  // UPDATE: toggle completed
  const toggleTask = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });

    const updatedTask = await res.json();

    setTasks(
      tasks.map(t => (t._id === id ? updatedTask : t))
    );
  };

  // DELETE: remove task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div>
      <h2>Task Manager</h2>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <span
              onClick={() => toggleTask(t._id, t.completed)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTask(t._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;