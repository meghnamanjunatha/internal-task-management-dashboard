import { useEffect, useState } from "react"

import api from "../services/api"

const dashboardItems = [
  { label: "Total Tasks", key: "total_tasks" },
  { label: "Pending Tasks", key: "pending_tasks" },
  { label: "In Progress Tasks", key: "in_progress_tasks" },
  { label: "Completed Tasks", key: "completed_tasks" },
  { label: "Overdue Tasks", key: "overdue_tasks" },
  { label: "Assigned to Me", key: "assigned_to_me" },
]

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get("/dashboard")
        setDashboard(response.data)
      } catch {
        setError("Unable to load dashboard data.")
      }
    }

    fetchDashboard()
  }, [])

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  if (!dashboard) {
    return <p className="p-6 text-gray-600">Loading dashboard...</p>
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <div
            key={item.key}
            className="rounded-lg bg-white p-5 shadow"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {dashboard[item.key]}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
