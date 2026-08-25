import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import CreateTask from "./pages/CreateTask"
import EditTask from "./pages/EditTask"
import ExternalUsers from "./pages/ExternalUsers"
import TaskDetails from "./pages/TaskDetails"
import Tasks from "./pages/Tasks"

function App() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "font-semibold text-blue-600"
      : "text-gray-600 hover:text-gray-900"

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="border-b border-gray-200 bg-white">
          <nav className="flex gap-6 px-6 py-4">
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <NavLink to="/external-users" className={linkClass}>
              External Users
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<CreateTask />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/external-users" element={<ExternalUsers />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
