import { useState } from "react"
import { useNavigate } from "react-router-dom"

import TaskForm from "../components/TaskForm"
import api from "../services/api"

export default function CreateTask() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(taskData) {
    setSubmitting(true)
    setSuccess("")
    setError("")

    try {
      await api.post("/tasks", taskData)
      setSuccess("Task created successfully.")

      setTimeout(() => {
        navigate("/tasks")
      }, 1000)
    } catch {
      setError("Unable to create task.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Create Task
        </h1>

        {success && (
          <p className="mb-4 text-green-600">{success}</p>
        )}

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <TaskForm
          onSubmit={handleSubmit}
          submitLabel="Create Task"
          submitting={submitting}
        />
      </div>
    </main>
  )
}
