
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import "./index.css";

const API_URL =
  "https://task-api-337b.rollout.click/api/tasks";

// Dashboard Component
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();

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
          title: title,
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
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  };

  // Toggle Task
  const toggleTask = async (task) => {
    try {
      const response = await fetch(
        `${API_URL}/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      fetchTasks();
    } catch (err) {
      setError("Unable to update task.");
    }
  };

  return (
    <div className="container">
      <h1>Task Management App</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
                  onChange={() =>
                    toggleTask(task)
                  }
                />

                <span
                  style={{
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {task.title}
                </span>
              </label>

              <button
                onClick={() =>
                  deleteTask(task.id)
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// About Component
function About() {
  return (
    <div className="container">
      <h1>About Task App</h1>

      <p>
        This is a Task Management Application
        built using React and Express.
      </p>

      <p>
        Users can add, update, and delete tasks.
      </p>
    </div>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link>
        {" | "}
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/about"
          element={<About />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;