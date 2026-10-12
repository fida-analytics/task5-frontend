
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function NotFound() {
  return (
    <main className="app-shell">
      <section className="task-card">
        <h1>404 - Page Not Found</h1>
        <p>Maazrat, yeh page nahi mila.</p>
        <NavLink to="/">Home par wapas jayein</NavLink>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <nav className="navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
