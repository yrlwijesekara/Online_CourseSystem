import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X, LogOut, User } from "lucide-react";

const Navbar = ({ navigateTo, currentPage = "home" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        try {
          const userData = JSON.parse(userString);
          setIsLoggedIn(true);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, [currentPage]); // Re-check when page changes

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentPage');
    setIsLoggedIn(false);
    setUser(null);
    if (navigateTo) {
      navigateTo('signin');
    }
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-green-100 to-pink-100 py-4">  
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 w-8 h-8 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">▭</span>
          </div>
          <span className="font-semibold text-lg">OnlineSchool</span>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium items-center">
          <li 
            className={`cursor-pointer ${currentPage === 'home' ? 'font-bold text-black' : 'hover:text-black/70'}`} 
            onClick={() => navigateTo && navigateTo('home')}
          >
            Home
          </li>
          <li 
            className={`cursor-pointer ${currentPage === 'course' ? 'font-bold text-black' : 'hover:text-black/70'}`} 
            onClick={() => navigateTo && navigateTo('course')}
          >
            Courses
          </li>
          <li 
            className={`cursor-pointer ${currentPage === 'about' ? 'font-bold text-black' : 'hover:text-black/70'}`}
            onClick={() => navigateTo && navigateTo('about')}
          >
            About Us
          </li>
          <li 
            className={`cursor-pointer ${currentPage === 'contact' ? 'font-bold text-black' : 'hover:text-black/70'}`}
            onClick={() => navigateTo && navigateTo('contact')}
          >
            Contact
          </li>
        </ul>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            // Authenticated user options
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User size={16} />
                <span>Welcome, {user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 border border-red-500 text-red-600 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            // Non-authenticated user options
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigateTo && navigateTo('signin')}
                className="text-sm font-medium hover:text-black/70 transition"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigateTo && navigateTo('signup')}
                className="flex items-center space-x-2 border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
              >
                <span>Sign Up</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Button (mobile) */}
        <button
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-100 to-pink-100 px-4 pt-2 pb-4">
          <ul className="flex flex-col space-y-3 text-sm font-medium">
            <li 
              className={`cursor-pointer ${currentPage === 'home' ? 'font-bold text-black' : ''}`}
              onClick={() => {
                navigateTo && navigateTo('home');
                setIsOpen(false);
              }}
            >
              Home
            </li>
            <li 
              className={`cursor-pointer ${currentPage === 'course' ? 'font-bold text-black' : 'hover:text-black/70'}`}
              onClick={() => {
                navigateTo && navigateTo('course');
                setIsOpen(false);
              }}
            >
              Courses
            </li>
            <li 
              className={`cursor-pointer ${currentPage === 'about' ? 'font-bold text-black' : 'hover:text-black/70'}`}
              onClick={() => {
                navigateTo && navigateTo('about');
                setIsOpen(false);
              }}
            >
              About Us
            </li>
            <li 
              className={`cursor-pointer ${currentPage === 'contact' ? 'font-bold text-black' : 'hover:text-black/70'}`}
              onClick={() => {
                navigateTo && navigateTo('contact');
                setIsOpen(false);
              }}
            >
              Contact
            </li>
          </ul>
          
          {/* Mobile Authentication Section */}
          {isLoggedIn ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <User size={16} />
                <span>Welcome, {user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 border border-red-500 text-red-600 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <button 
                onClick={() => {
                  navigateTo && navigateTo('signin');
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-medium hover:text-black/70 transition"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  navigateTo && navigateTo('signup');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
              >
                <span>Sign Up</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;