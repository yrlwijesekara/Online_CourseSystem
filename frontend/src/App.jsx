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
  
  // Check if a user is authenticated
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      return !!(token && userString);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return false;
      const user = JSON.parse(userString);
      return user.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Function to navigate between pages with auth check
  const navigateTo = (page, params = {}) => {
    // List of pages that require authentication
    const protectedPages = ['course', 'admin', 'admin-courses', 'course-content', 'profile', 'my-courses'];
    
    // List of admin-only pages
    const adminOnlyPages = ['admin', 'admin-courses'];

    if (protectedPages.includes(page) && !isAuthenticated()) {
      console.log(`Access to ${page} denied - user not authenticated`);
      // Store the intended destination to redirect after login
      localStorage.setItem('redirectAfterLogin', page);
      // Store any params needed for the redirect
      if (Object.keys(params).length > 0) {
        localStorage.setItem('redirectParams', JSON.stringify(params));
      }
      setCurrentPage('signin');
      localStorage.setItem('currentPage', 'signin');
      return;
    }

    if (adminOnlyPages.includes(page) && !isAdmin()) {
      console.log(`Access to ${page} denied - user not admin`);
      setCurrentPage('home');
      localStorage.setItem('currentPage', 'home');
      return;
    }

    // If passed authentication checks, navigate to the requested page
    console.log(`Navigating to: ${page}`);
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

  // Check authentication status before rendering the page
  const renderPage = () => {
    // List of pages that require authentication
    const protectedPages = ['course', 'admin', 'admin-courses', 'course-content', 'profile', 'my-courses'];
    
    // List of admin-only pages
    const adminOnlyPages = ['admin', 'admin-courses'];

    // If trying to access a protected page without authentication
    if (protectedPages.includes(pageToRender) && !isAuthenticated()) {
      console.log(`Access to ${pageToRender} denied - user not authenticated, redirecting to signin`);
      // Store the attempted page for redirect after login
      localStorage.setItem('redirectAfterLogin', pageToRender);
      // Render signin page instead
      return <SignInPage navigateTo={navigateTo} />;
    }

    // If trying to access admin page without admin role
    if (adminOnlyPages.includes(pageToRender) && !isAdmin()) {
      console.log(`Access to ${pageToRender} denied - user not admin, redirecting to home`);
      // Render home page instead
      return <HomePage navigateTo={navigateTo} />;
    }

    // Otherwise render the requested page
    switch (pageToRender) {
      case 'course':
        return <CoursePage navigateTo={navigateTo} />;
      case 'signin':
        return <SignInPage navigateTo={navigateTo} />;
      case 'signup':
        return <SignUpPage navigateTo={navigateTo} />;
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'contact':
        return <ContactUs navigateTo={navigateTo} />;
      case 'about':
        return <AboutUs navigateTo={navigateTo} />;
      case 'admin':
        return <Admin navigateTo={navigateTo} />;
      case 'admin-courses':
        return <AdminCourses navigateTo={navigateTo} />;
      default:
        return <SignInPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  )
} 

export default App;