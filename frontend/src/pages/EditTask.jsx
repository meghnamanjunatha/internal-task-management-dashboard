import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import TaskForm from "../components/TaskForm"
import api from "../services/api"

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    async function fetchTask() {
      try {
        const response = await api.get(`/tasks/${id}`)

        if (!ignore) {
          setTask({
            ...response.data,
            description: response.data.description ?? "",
            assigned_to: response.data.assigned_to ?? "",
            due_date: response.data.due_date
              ? response.data.due_date.slice(0, 16)
              : "",
          })
        }
      } catch {
        if (!ignore) {
          setError("Unable to load task.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchTask()

    return () => {
      ignore = true
    }
  }, [id])

  async function handleSubmit(taskData) {
    setSubmitting(true)
    setError("")

    try {
      await api.put(`/tasks/${id}`, taskData)
      navigate("/tasks")
    } catch {
      setError("Unable to update task.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading task...</p>
  }

  if (!task) {
    return (
      <p className="p-6 text-red-600">
        {error || "Task not found."}
      </p>
    )
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Edit Task
        </h1>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          submitLabel="Update Task"
          submitting={submitting}
        />
      </div>
    </main>
  )
}
