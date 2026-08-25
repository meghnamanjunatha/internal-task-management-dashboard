import { useEffect, useState } from "react"

import api from "../services/api"

export default function ExternalUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    async function fetchExternalUsers() {
      try {
        const response = await api.get("/external/users")

        if (!ignore) {
          setUsers(response.data)
        }
      } catch {
        if (!ignore) {
          setError("Unable to load external users.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchExternalUsers()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-600">Loading external users...</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        External Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No external users found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="mt-2 text-gray-600">{user.email}</p>
              <p className="mt-1 text-gray-600">{user.phone}</p>
              <p className="mt-3 text-sm font-medium text-gray-500">
                {user.company_name}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
