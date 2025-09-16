import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-green-100 to-pink-100 py-4">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* OnlineSchool Section */}
        <div className="flex flex-col items-center sm:items-start px-2">
          <div className="flex items-center mb-2">
            <div><img src="/footericon.png" alt="OnlineSchool Logo" className="w-6 h-6 sm:w-8 sm:h-8" /></div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold ml-2">OnlineSchool</h3>
          </div>
          <p className="text-xs sm:text-sm mb-2 text-center sm:text-left max-w-[90%] sm:max-w-xs">
            Unlock knowledge with expert-led online courses.
          </p>
          <h1 className="text-xs sm:text-sm lg:text-base font-semibold text-left py-2">Stay Connected</h1> 
          <div className="flex space-x-2 sm:space-x-3">
            <a href="#" className="text-gray-600 hover:text-gray-800 text-base sm:text-lg">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-base sm:text-lg">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-base sm:text-lg">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-base sm:text-lg">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="text-center sm:text-left px-2">
          <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 inline-block">Quick Links</h4>
          <ul className="space-y-0.5 text-xs sm:text-sm list-none pl-0">
            <li><a href="#" className="hover:text-gray-600">Home</a></li>
            <li><a href="#" className="hover:text-gray-600">Courses</a></li>
            <li><a href="#" className="hover:text-gray-600">About Us</a></li>
            <li><a href="#" className="hover:text-gray-600">Contact</a></li>
          </ul>
        </div>

        {/* Others Section */}
        <div className="text-center sm:text-left px-2">
          <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 inline-block">Others</h4>
          <ul className="space-y-0.5 text-xs sm:text-sm list-none pl-0">
            <li><a href="#" className="hover:text-gray-600">Mentors</a></li>
            <li><a href="#" className="hover:text-gray-600">Blog</a></li>
            <li><a href="#" className="hover:text-gray-600">404</a></li>
            <li><a href="#" className="hover:text-gray-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gray-600">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="text-center sm:text-left px-2">
          <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 inline-block">Contact Us</h4>
          <ul className="space-y-0.5 text-xs sm:text-sm list-none pl-0">
            <li><a href="tel:+94712347650" className="hover:text-gray-600">+94 712 347 650</a></li>
            <li><a href="mailto:hello@onlineschool.com" className="hover:text-gray-600">hello@onlineschool.com</a></li>
            <li><span className="hover:text-gray-600">Colombo 10, Colombo</span></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-4 sm:mt-6">
        <p>2025 © Fuchsius. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;