
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./index.css";

const API_URL = "http://localhost:8080/api/tasks";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load tasks.");

      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch {
      setError("Unable to connect to the API. Check that the backend is running.");
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
      setError("Please enter a task title.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not create task.");
      }

      setTitle("");
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to add task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTask(task, changes) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: changes.title ?? task.title,
          completed: changes.completed ?? Boolean(task.completed),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not update task.");
      }

      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to update task.");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setError("");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete task.");
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Task Management</h1>
        <p>Plan your work, track progress, and get things done.</p>
      </section>

      <section className="stats" aria-label="Task summary">
        <article className="stat-card">
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </article>
        <article className="stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </article>
        <article className="stat-card">
          <span>Remaining</span>
          <strong>{tasks.length - completedCount}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Create a task</h2>
        <form className="task-form" onSubmit={addTask}>
          <input
            aria-label="New task title"
            maxLength={200}
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add task"}
          </button>
        </form>
      </section>

      {error && (
        <div className="error" role="alert">
          {error}
          <button className="secondary-button" onClick={fetchTasks}>
            Retry
          </button>
        </div>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Your tasks</h2>
            <p>Manage everything in one place.</p>
          </div>
          <button className="secondary-button" onClick={fetchTasks}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p role="status">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Add your first task using the form above.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item" key={task.id}>
                {editingId === task.id ? (
                  <form
                    className="edit-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (editTitle.trim()) {
                        updateTask(task, { title: editTitle.trim() });
                      }
                    }}
                  >
                    <input
                      aria-label="Edit task title"
                      value={editTitle}
                      maxLength={200}
                      onChange={(event) => setEditTitle(event.target.value)}
                      autoFocus
                    />
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={Boolean(task.completed)}
                        onChange={(event) =>
                          updateTask(task, { completed: event.target.checked })
                        }
                      />
                      <span className={task.completed ? "completed" : ""}>
                        {task.title}
                      </span>
                    </label>
                    <div className="task-actions">
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="container panel">
      <h1>About this application</h1>
      <p>
        A responsive task management application built with React and React
        Router, integrated with a Node.js, Express, and SQLite REST API.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Create, view, edit, and delete tasks.</li>
        <li>Mark tasks as completed.</li>
        <li>Track task progress on the dashboard.</li>
        <li>Handle API loading and error states.</li>
      </ul>
    </main>
  );
}

function AppLayout() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">TaskFlow</Link>
        <nav aria-label="Main navigation">
          <Link to="/">Dashboard</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="site-footer">TaskFlow · Built with React</footer>
    </>
  );
}

function ErrorBoundaryFallback() {
  return (
    <main className="container panel">
      <h1>Something went wrong</h1>
      <p>Please refresh the page and try again.</p>
      <button onClick={() => window.location.reload()}>Reload app</button>
    </main>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Application rendering error:", error, info);
  }

  render() {
    return this.state.hasError ? <ErrorBoundaryFallback /> : this.props.children;
  }
}

import React from "react";

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;