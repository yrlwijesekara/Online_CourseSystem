import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const Navbar = ({ navigateTo, currentPage = "home" }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
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
          <li className="hover:text-black/70 cursor-pointer">About Us</li>
          <li 
            className={`cursor-pointer ${currentPage === 'contact' ? 'font-bold text-black' : 'hover:text-black/70'}`}
            onClick={() => navigateTo && navigateTo('contact')}
          >
            Contact
          </li>
          <li className="hover:text-black/70 cursor-pointer">Profile</li>
        </ul>

        {/* Enroll Now Button (desktop) */}
        <button className="hidden md:flex items-center space-x-3 border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition">
          <span>Enroll Now</span>
          <div className="bg-black text-white p-1 rounded-full">
            <ArrowUpRight size={16} />
          </div>
        </button>

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
            <li className="hover:text-black/70 cursor-pointer">About Us</li>
            <li 
              className={`cursor-pointer ${currentPage === 'contact' ? 'font-bold text-black' : 'hover:text-black/70'}`}
              onClick={() => {
                navigateTo && navigateTo('contact');
                setIsOpen(false);
              }}
            >
              Contact
            </li>
            <li className="hover:text-black/70 cursor-pointer">Profile</li>
          </ul>
          <button className="mt-4 flex items-center justify-center space-x-3 border border-black px-4 py-2 rounded-full w-full hover:bg-black hover:text-white transition">
            <span>Enroll Now</span>
            <div className="bg-black text-white p-1 rounded-full">
              <ArrowUpRight size={16} />
            </div>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
