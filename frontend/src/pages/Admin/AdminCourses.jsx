import { BookOpen, Plus } from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar";
import AddNewCourse from "./AddNewCourse";
import { useState } from "react";

export default function AdminCourses({ navigateTo }) {
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    
    // Sample course data - in a real app, this would come from an API
    const courses = [
        {
            id: "#12345",
            title: "Introduction to Programming",
            instructor: "Dr. Eleanor Harper",
            category: "Computer Science",
            price: "$49.99",
            enrolled: "150",
            status: "active"
        },
        {
            id: "#67890",
            title: "Advanced Calculus",
            instructor: "Prof. Samuel Bennett",
            category: "Mathematics",
            price: "$79.99",
            enrolled: "85",
            status: "active"
        },
        {
            id: "#24680",
            title: "Creative Writing Workshop",
            instructor: "Ms. Olivia Carter",
            category: "Arts & Humanities",
            price: "$39.99",
            enrolled: "200",
            status: "pending"
        },
        {
            id: "#13579",
            title: "Digital Marketing Fundamentals",
            instructor: "Mr. Ethan Davis",
            category: "Business",
            price: "$59.99",
            enrolled: "120",
            status: "draft"
        },
        {
            id: "#98765",
            title: "Spanish for Beginners",
            instructor: "Sra. Isabella Rodriguez",
            category: "Languages",
            price: "$29.99",
            enrolled: "250",
            status: "active"
        }
    ];

    // Sample approval requests
    const approvalRequests = [
        {
            id: "#11223",
            title: "Data Science Essentials",
            instructor: "Dr. Liam Walker",
            category: "Data Science",
            price: "$69.99"
        },
        {
            id: "#44556",
            title: "Graphic Design Masterclass",
            instructor: "Ms. Chloe Turner",
            category: "Design",
            price: "$89.99"
        }
    ];

    // Render the status badge with appropriate color
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                    </span>
                );
            case 'draft':
                return (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Draft
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex bg-gray-50">
            {/* Admin Sidebar */}
            <AdminSideBar navigateTo={navigateTo} />

            {/* Main Content */}
            <div className="flex-1  h-full p-8 overflow-hidden">
                {/* Header - Title and Add Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                    <button 
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={() => setShowAddCourseForm(true)}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add New Course
                    </button>
                </div>
                
                {/* Add New Course Form Modal */}
                {showAddCourseForm && (
                    <AddNewCourse onClose={() => setShowAddCourseForm(false)} />
                )}

                {/* All Courses Section */}
                <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">All Courses</h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courses.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrolled}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatusBadge(course.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Course Approval Requests Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Course Approval Requests</h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {approvalRequests.map((request, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.instructor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition">
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}