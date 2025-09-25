import AdminSideBar from "../../components/AdminSideBar";

export default function Admin({ navigateTo }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Admin Sidebar */}
            <AdminSideBar navigateTo={navigateTo} />

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome to the admin dashboard. Use the sidebar to navigate to different sections.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Courses</h3>
                            <p className="text-red-600">Manage all courses</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Students</h3>
                            <p className="text-blue-600">View student information</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Instructors</h3>
                            <p className="text-green-600">Manage instructors</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                            <h3 className="text-lg font-semibold text-purple-800 mb-2">Revenue</h3>
                            <p className="text-purple-600">Track earnings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}