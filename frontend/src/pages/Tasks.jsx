import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import api from "../services/api"

const PAGE_LIMIT = 10

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "—"
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [assignee, setAssignee] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let ignore = false

    async function fetchTasks() {
      setLoading(true)
      setError("")

      try {
        const response = await api.get("/tasks", {
          params: {
            search: search || undefined,
            status: status || undefined,
            priority: priority || undefined,
            assignee: assignee || undefined,
            page,
            limit: PAGE_LIMIT,
          },
        })

        if (!ignore) {
          setTasks(response.data)
        }
      } catch {
        if (!ignore) {
          setError("Unable to load tasks.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchTasks()

    return () => {
      ignore = true
    }
  }, [search, status, priority, assignee, page])

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(task.id)
    setDeleteError("")

    try {
      await api.delete(`/tasks/${task.id}`)
      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask.id !== task.id),
      )
    } catch {
      setDeleteError("Unable to delete task.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link
          to="/tasks/new"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white"
        >
          Create Task
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search tasks"
          className="rounded border border-gray-300 px-3 py-2"
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>

        <select
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value)
            setPage(1)
          }}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="number"
          min="1"
          value={assignee}
          onChange={(event) => {
            setAssignee(event.target.value)
            setPage(1)
          }}
          placeholder="Assignee ID"
          className="rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {deleteError && (
        <p className="mb-4 text-red-600">{deleteError}</p>
      )}

      {loading && <p className="text-gray-600">Loading tasks...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Assignee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-4 py-3">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {task.assigned_to ?? "—"}
                      </td>
                      <td className="px-4 py-3">{task.priority}</td>
                      <td className="px-4 py-3">{task.status}</td>
                      <td className="px-4 py-3">
                        {formatDate(task.due_date)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(task.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(task.updated_at)}
                      </td>
                      <td className="flex items-center gap-3 px-4 py-3">
                        <Link
                          to={`/tasks/${task.id}/edit`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === task.id}
                          onClick={() => handleDelete(task)}
                          className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {deletingId === task.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">Page {page}</span>

            <button
              type="button"
              disabled={tasks.length < PAGE_LIMIT}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  )
}
