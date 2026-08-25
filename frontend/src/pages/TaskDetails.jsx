import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import api from "../services/api"

const CURRENT_USER_ID = 1

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "—"
}

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [commentError, setCommentError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchTaskDetails() {
      try {
        const [taskResponse, commentsResponse] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get(`/tasks/${id}/comments`),
        ])

        if (!ignore) {
          setTask(taskResponse.data)
          setComments(commentsResponse.data)
        }
      } catch {
        if (!ignore) {
          setError("Unable to load task details.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchTaskDetails()

    return () => {
      ignore = true
    }
  }, [id])

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setDeleteError("")

    try {
      await api.delete(`/tasks/${id}`)
      navigate("/tasks")
    } catch {
      setDeleteError("Unable to delete task.")
      setDeleting(false)
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault()

    const trimmedComment = comment.trim()

    if (!trimmedComment) {
      return
    }

    setSubmitting(true)
    setCommentError("")

    try {
      const response = await api.post(`/tasks/${id}/comments`, {
        user_id: CURRENT_USER_ID,
        comment: trimmedComment,
      })

      setComments((currentComments) => [
        ...currentComments,
        response.data,
      ])
      setComment("")
    } catch {
      setCommentError("Unable to add comment.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading task details...</p>
  }

  if (error || !task) {
    return (
      <p className="p-6 text-red-600">
        {error || "Task not found."}
      </p>
    )
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {task.title}
            </h1>
            <div className="flex gap-3">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white"
              >
                Edit
              </Link>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {deleteError && (
            <p className="mb-4 text-red-600">{deleteError}</p>
          )}

          <p className="mb-6 whitespace-pre-wrap text-gray-700">
            {task.description || "No description provided."}
          </p>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>
              <dd className="mt-1 text-gray-900">{task.status}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Priority
              </dt>
              <dd className="mt-1 text-gray-900">{task.priority}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Assigned To
              </dt>
              <dd className="mt-1 text-gray-900">
                {task.assigned_to ?? "Unassigned"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Due Date
              </dt>
              <dd className="mt-1 text-gray-900">
                {formatDate(task.due_date)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Created
              </dt>
              <dd className="mt-1 text-gray-900">
                {formatDate(task.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Updated
              </dt>
              <dd className="mt-1 text-gray-900">
                {formatDate(task.updated_at)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Comments
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="3"
              required
              placeholder="Add a comment"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />

            {commentError && (
              <p className="mt-2 text-sm text-red-600">
                {commentError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Comment"}
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((taskComment) => (
                <article
                  key={taskComment.id}
                  className="rounded border border-gray-200 p-4"
                >
                  <p className="whitespace-pre-wrap text-gray-800">
                    {taskComment.comment}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    User {taskComment.user_id} ·{" "}
                    {formatDate(taskComment.created_at)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
