import React, { useState } from 'react';
import { Plus, Eye, Star } from 'lucide-react';
import AdminSideBar from '../../components/AdminSideBar';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Dr. Amelia Turner",
      email: "amelia.turner@email.com",
      totalCourses: 5,
      rating: 4.8,
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Liam Harris",
      email: "liam.harris@email.com",
      totalCourses: 3,
      rating: 4.5,
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Harper Lewis",
      email: "harper.lewis@email.com",
      totalCourses: 2,
      rating: 4.2,
      status: "Blocked"
    },
    {
      id: 4,
      name: "Prof. Owen Carter",
      email: "owen.carter@email.com",
      totalCourses: 4,
      rating: 4.7,
      status: "Active"
    },
    {
      id: 5,
      name: "Dr. Isabella Reed",
      email: "isabella.reed@email.com",
      totalCourses: 6,
      rating: 4.9,
      status: "Active"
    }
  ]);

  const handleStatusToggle = (id) => {
    setInstructors(instructors.map(instructor => 
      instructor.id === id 
        ? { ...instructor, status: instructor.status === "Active" ? "Blocked" : "Active" }
        : instructor
    ));
  };

  const handleViewDetails = (instructor) => {
    console.log("View details for:", instructor.name);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex-1 p-6">
    
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Instructors</h1>
        <button className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition-colors duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add New Instructor
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
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
                  RATING
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {instructor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {instructor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {instructor.totalCourses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
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
                  <span className="text-sm text-gray-500">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-900">{instructor.rating}</span>
                  </div>
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
            {instructors.filter(i => i.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Blocked Instructors</p>
          <p className="text-2xl font-bold text-red-600">
            {instructors.filter(i => i.status === "Blocked").length}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminInstructors;