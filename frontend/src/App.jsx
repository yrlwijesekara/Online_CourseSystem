import './App.css'
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage';
import CoursePage from './pages/CoursePage';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Admin from './pages/Admin/admin';
import AdminCourses from './pages/Admin/AdminCourses';


function App() {
  // Use state to manage which page is displayed
  const [currentPage, setCurrentPage] = useState(null); // Start with null to ensure loading shows
  const [isLoading, setIsLoading] = useState(true); // Loading state
  
  // Check authentication status on app initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('Starting auth check...');
      
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        console.log('Auth data found:', { hasToken: !!token, hasUser: !!userString });
        
        if (token && userString) {
          const user = JSON.parse(userString);
          
          // Restore the previous page if available, otherwise use default
          const savedPage = localStorage.getItem('currentPage');
          
          if (savedPage && savedPage !== 'signin' && savedPage !== 'signup') {
            // Validate that the saved page is appropriate for the user role
            if (user.role === 'ADMIN' && (savedPage === 'admin' || savedPage === 'admin-courses')) {
              setCurrentPage(savedPage);
            } else if (user.role !== 'ADMIN' && !savedPage.startsWith('admin')) {
              setCurrentPage(savedPage);
            } else {
              // Default fallback based on role
              setCurrentPage(user.role === 'ADMIN' ? 'admin' : 'home');
            }
          } else {
            // No saved page or invalid saved page, use default
            setCurrentPage(user.role === 'ADMIN' ? 'admin' : 'home');
          }
        } else {
          // No authentication data found, redirect to signin
          console.log('No auth data found, redirecting to signin');
          setCurrentPage('signin');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data and redirect to signin
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentPage');
        setCurrentPage('signin');
      } finally {
        // Always stop loading after auth check
        console.log('Auth check completed, setting loading to false');
        setIsLoading(false);
      }
    };

    // Small delay to prevent flash, then check authentication
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  // Function to navigate between pages
  const navigateTo = (page) => {
    setCurrentPage(page);
    // Store current page in localStorage for persistence across refreshes
    localStorage.setItem('currentPage', page);
  };

  // Function to handle proper logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentPage');
    setCurrentPage('signin');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('Rendering loading screen, isLoading:', isLoading, 'currentPage:', currentPage);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Fallback to signin if currentPage is null
  const pageToRender = currentPage || 'signin';
  console.log('Rendering page:', pageToRender, 'currentPage:', currentPage, 'isLoading:', isLoading);

  return (
    <div className="min-h-screen">
      {pageToRender === 'course' && <CoursePage navigateTo={navigateTo} />}
      {pageToRender === 'signin' && <SignInPage navigateTo={navigateTo} />}
      {pageToRender === 'signup' && <SignUpPage navigateTo={navigateTo} />}
      {pageToRender === 'home' && <HomePage navigateTo={navigateTo} />}
      {pageToRender === 'contact' && <ContactUs navigateTo={navigateTo} />}
      {pageToRender === 'about' && <AboutUs navigateTo={navigateTo} />}
      {pageToRender === 'admin' && <Admin navigateTo={navigateTo} />}
      {pageToRender === 'admin-courses' && <AdminCourses navigateTo={navigateTo} />}
    </div>
  )
} 

export default App;