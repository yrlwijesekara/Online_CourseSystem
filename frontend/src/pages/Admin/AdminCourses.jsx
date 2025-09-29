import { BookOpen, Plus } from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar";
import AddNewCourse from "./AddNewCourse";
import EditCourse from "./EditCourse";
import { useState, useEffect } from "react";

export default function AdminCourses({ navigateTo }) {
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [showEditCourseForm, setShowEditCourseForm] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Fetch courses from API
    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://localhost:3001/api/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const coursesData = await response.json();
            
            // Transform the data to match the expected format
            const transformedCourses = coursesData.map(course => ({
                id: `#${course.id}`,
                title: course.title,
                instructor: course.instructor?.name || 'Unknown Instructor',
                category: course.category || 'General',
                price: 'Free', // Since we removed priceCents from schema
                enrolled: course.enrollments?.length?.toString() || '0',
                status: course.isPublished ? 'active' : 'draft'
            }));
            
            setCourses(transformedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchPendingCourses();
    }, []);

    // Handle course approval
    const handleApproveCourse = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/courses/${courseId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to approve course');
            }

            // Refresh both lists
            fetchCourses();
            fetchPendingCourses();
        } catch (error) {
            console.error('Error approving course:', error);
        }
    };

    // Handle course rejection
    const handleRejectCourse = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/courses/${courseId}/reject`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject course');
            }

            // Refresh pending list
            fetchPendingCourses();
        } catch (error) {
            console.error('Error rejecting course:', error);
        }
    };

    // Handle course deletion
    const handleDeleteCourse = async (courseIdString) => {
        const courseId = courseIdString.replace('#', '');
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete course');
                }

                // Refresh courses list
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    // Handle when a new course is added
    const handleCourseAdded = (newCourse) => {
        // Add the new course to the list
        const transformedCourse = {
            id: `#${newCourse.id}`,
            title: newCourse.title,
            instructor: newCourse.instructor?.name || 'Unknown Instructor',
            category: newCourse.category || 'General',
            price: 'Free', // Since we removed priceCents from schema
            enrolled: '0',
            status: newCourse.isPublished ? 'active' : 'draft'
        };
        setCourses(prev => [...prev, transformedCourse]);
    };

    // Handle edit course
    const handleEditCourse = (courseIdString) => {
        const courseId = courseIdString.replace('#', '');
        setEditingCourseId(parseInt(courseId));
        setShowEditCourseForm(true);
    };

    // Handle when a course is updated
    const handleCourseUpdated = (updatedCourse) => {
        console.log('handleCourseUpdated called with:', updatedCourse);
        
        // Update the course in the list
        const transformedCourse = {
            id: `#${updatedCourse.id}`,
            title: updatedCourse.title,
            instructor: updatedCourse.instructor?.name || 'Unknown Instructor',
            category: updatedCourse.category || 'General',
            price: 'Free', // Since we removed priceCents from schema
            enrolled: updatedCourse.enrollments?.length?.toString() || '0',
            status: updatedCourse.isPublished ? 'active' : 'draft'
        };
        
        console.log('Transformed course:', transformedCourse);
        
        setCourses(prev => {
            const updated = prev.map(course => 
                course.id === `#${updatedCourse.id}` ? transformedCourse : course
            );
            console.log('Updated courses list:', updated);
            return updated;
        });
    };
    
    // State for approval requests
    const [approvalRequests, setApprovalRequests] = useState([]);
    const [loadingApprovals, setLoadingApprovals] = useState(true);

    // Fetch pending courses for approval
    const fetchPendingCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://localhost:3001/api/courses/admin/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending courses');
            }

            const pendingCourses = await response.json();
            
            // Transform the data for approval requests
            const transformedRequests = pendingCourses.map(course => ({
                id: `#${course.id}`,
                title: course.title,
                instructor: course.instructor?.name || 'Unknown Instructor',
                category: course.category || 'General',
                price: 'Free', // Since we removed priceCents from schema
                originalId: course.id // Keep the original ID for API calls
            }));
            
            setApprovalRequests(transformedRequests);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
        } finally {
            setLoadingApprovals(false);
        }
    };

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
        <div className="flex min-h-screen bg-gray-50">
            {/* Admin Sidebar */}
            <AdminSideBar navigateTo={navigateTo} />

            {/* Main Content */}
            <div className="flex-1 p-8">
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
                    <AddNewCourse 
                        onClose={() => setShowAddCourseForm(false)} 
                        onCourseAdded={handleCourseAdded}
                    />
                )}

                {/* All Courses Section */}
                <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">All Courses</h2>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-6 bg-red-100 border border-red-400 text-red-700">
                            Error: {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="p-6 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            <p className="mt-2 text-gray-600">Loading courses...</p>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {courses.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No courses found. Create your first course!
                                            </td>
                                        </tr>
                                    ) : (
                                        courses.map((course, index) => (
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button 
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition"
                                                        onClick={() => handleEditCourse(course.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition"
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Course Approval Requests Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Course Approval Requests</h2>
                    </div>

                    {/* Loading State for Approvals */}
                    {loadingApprovals && (
                        <div className="p-6 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            <p className="mt-2 text-gray-600">Loading pending courses...</p>
                        </div>
                    )}

                    {/* Table */}
                    {!loadingApprovals && (
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
                                    {approvalRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No pending courses for approval
                                            </td>
                                        </tr>
                                    ) : (
                                        approvalRequests.map((request, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.instructor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button 
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition"
                                                        onClick={() => handleApproveCourse(request.originalId)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition"
                                                        onClick={() => handleRejectCourse(request.originalId)}
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Course Modal */}
            {showEditCourseForm && editingCourseId && (
                <EditCourse 
                    courseId={editingCourseId}
                    onClose={() => {
                        setShowEditCourseForm(false);
                        setEditingCourseId(null);
                    }}
                    onCourseUpdated={handleCourseUpdated}
                />
            )}
        </div>
    );
}