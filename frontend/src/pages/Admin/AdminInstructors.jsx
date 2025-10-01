"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, X } from "lucide-react"
import AdminSideBar from "../../components/AdminSideBar"
import api from "../../api"

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/instructors")
      setInstructors(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching instructors:", error)
      setError("Failed to fetch instructors. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id) => {
    try {
      const instructor = instructors.find((i) => i.id === id)
      const newStatus = instructor.status === "Active" ? "Blocked" : "Active"

      await api.put(`/admin/instructors/${id}/status`, { status: newStatus })

      setInstructors(
        instructors.map((instructor) => (instructor.id === id ? { ...instructor, status: newStatus } : instructor)),
      )
    } catch (error) {
      console.error("Error updating instructor status:", error)
      setError("Failed to update instructor status. Please try again.")
    }
  }

  const handleViewDetails = (instructor) => {
    console.log("View details for:", instructor.name)
  }

  const handleAddInstructor = async (e) => {
    e.preventDefault()

    if (!newInstructor.name || !newInstructor.email || !newInstructor.password) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post("/admin/instructors", newInstructor)

      // Add the new instructor to the list with default values
      const instructorWithStats = {
        ...response.data,
        totalCourses: 0,
        activeCourses: 0,
        status: "Active",
        courses: [],
      }

      setInstructors([...instructors, instructorWithStats])
      setShowAddModal(false)
      setNewInstructor({ name: "", email: "", password: "", bio: "" })
      setError(null)
    } catch (error) {
      console.error("Error creating instructor:", error)
      setError(error.response?.data?.error || "Failed to create instructor. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSideBar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading instructors...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Manage Instructors</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Instructor
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL COURSES
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIVE COURSES
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{instructor.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {instructor.totalCourses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {instructor.activeCourses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(instructor.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          instructor.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {instructor.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewDetails(instructor)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{instructor.name}</h3>
                    <p className="text-sm text-gray-500">ID: {instructor.id}</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(instructor)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm text-gray-900">{instructor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Courses:</span>
                    <span className="text-sm text-gray-900">{instructor.totalCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active Courses:</span>
                    <span className="text-sm text-gray-900">{instructor.activeCourses}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <button
                    onClick={() => handleStatusToggle(instructor.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      instructor.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {instructor.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total Instructors</p>
            <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Active Instructors</p>
            <p className="text-2xl font-bold text-green-600">
              {instructors.filter((i) => i.status === "Active").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Blocked Instructors</p>
            <p className="text-2xl font-bold text-red-600">
              {instructors.filter((i) => i.status === "Blocked").length}
            </p>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Instructor</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setNewInstructor({ name: "", email: "", password: "", bio: "" })
                    setError(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddInstructor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newInstructor.name}
                    onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newInstructor.email}
                    onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={newInstructor.password}
                    onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
                  <textarea
                    value={newInstructor.bio}
                    onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewInstructor({ name: "", email: "", password: "", bio: "" })
                      setError(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Instructor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInstructors
