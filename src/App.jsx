
import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./index.css";

const API_URL = "http://localhost:3000/api/tasks";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(data.tasks);
      setError("");
    } catch (err) {
      setError("Unable to connect to the API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Unable to add task.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      fetchTasks();
    } catch (err) {
      setError("Unable to update task.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">TASK MANAGEMENT</p>

        <h1>Organize your day.</h1>

        <p>
          Manage your tasks using React and a REST API.
        </p>
      </section>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="task-card">
        <div className="section-heading">
          <h2>Your Tasks</h2>

          <span>{tasks.length} tasks</span>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">
            No tasks yet. Add your first task!
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />

                  <span
                    className={
                      task.completed ? "completed" : ""
                    }
                  >
                    {task.title}
                  </span>
                </label>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="container">
      <section className="task-card">
        <h1>About This App</h1>

        <p>
          This single-page application uses React,
          React Router, Node.js, and SQLite.
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">TaskFlow</Link>

        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;