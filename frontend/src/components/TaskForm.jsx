import { useEffect, useState } from "react"

import api from "../services/api"

const defaultValues = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  assigned_to: "",
  due_date: "",
}

export default function TaskForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Save Task",
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues,
  })
  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState("")

  useEffect(() => {
    let ignore = false

    async function fetchUsers() {
      try {
        const response = await api.get("/users")

        if (!ignore) {
          setUsers(response.data)
        }
      } catch {
        if (!ignore) {
          setUsersError("Unable to load users.")
        }
      }
    }

    fetchUsers()

    return () => {
      ignore = true
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      ...formData,
      assigned_to: formData.assigned_to
        ? Number(formData.assigned_to)
        : null,
      due_date: formData.due_date || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assigned_to"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Assignee
          </label>
          <select
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {usersError && (
            <p className="mt-1 text-sm text-red-600">{usersError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="due_date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="datetime-local"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  )
}
