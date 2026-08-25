import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import api from "../services/api"

const PAGE_LIMIT = 10

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
}

const priorityStyles = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "—"
}

function formatLabel(value) {
  return value.replaceAll("_", " ")
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
    <main className="mx-auto max-w-screen-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search, filter, and manage team tasks.
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Task
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium text-gray-700">
            Search
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search tasks"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Status
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Priority
            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value)
                setPage(1)
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Assignee
            <input
              type="number"
              min="1"
              value={assignee}
              onChange={(event) => {
                setAssignee(event.target.value)
                setPage(1)
              }}
              placeholder="Assignee ID"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>

      {deleteError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {deleteError}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="mt-3 text-sm text-gray-600">Loading tasks...</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-medium">Unable to load tasks</p>
          <p className="mt-1">
            Please check the backend connection and try again.
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assignee
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Updated
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-14 text-center"
                    >
                      <p className="font-medium text-gray-700">
                        No tasks found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="min-w-56 px-5 py-4">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {task.assigned_to ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            priorityStyles[task.priority] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {formatLabel(task.priority)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            statusStyles[task.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {formatLabel(task.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(task.due_date)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(task.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(task.updated_at)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {page}
            </span>

            <button
              type="button"
              disabled={tasks.length < PAGE_LIMIT}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  )
}
