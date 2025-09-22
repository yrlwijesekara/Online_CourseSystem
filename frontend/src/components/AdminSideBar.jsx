import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BookOpen, 
  DollarSign,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const AdminSideBar = ({ navigateTo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: true,
      page: 'admin'
    },
    {
      icon: Users,
      label: 'Students',
      active: false,
      page: 'admin-students'
    },
    {
      icon: UserCheck,
      label: 'Instructors',
      active: false,
      page: 'admin-instructors'
    },
    {
      icon: BookOpen,
      label: 'Courses',
      active: false,
      page: 'admin-courses'
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      active: false,
      page: 'admin-revenue'
    }
  ];

  const handleNavigation = (page) => {
    if (navigateTo) {
      navigateTo(page);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* AdminSideBar */}
      <aside className={`
        fixed lg:static
        top-0 left-0 z-40
        w-64 h-screen
        bg-white
        border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">
                EduPlatform
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href="#"
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg
                        transition-colors duration-200
                        ${item.active 
                          ? 'bg-red-50 text-red-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => handleNavigation(item.page)}
                    >
                      <Icon className={`
                        w-5 h-5 mr-3
                        ${item.active ? 'text-red-500' : 'text-gray-400'}
                      `} />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            
            {/* Logout Button */}
            <div className="mt-8">
              <a
                href="#"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                onClick={() => handleNavigation('signin')}
              >
                <LogOut className="w-5 h-5 mr-3 text-gray-400" />
                Logout
              </a>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;