import React from 'react';
import FaqComponent from '../components/FAQ';
import Footer from '../components/Footer';
import Navbar from "../components/NavBar";

const ContactForm = ({ navigateTo }) => {
  return (
    <>
      <Navbar navigateTo={navigateTo} currentPage="contact" />
      <div className="w-full bg-gradient-to-r from-green-100 to-pink-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mt-6 mb-0">Have Any Questions!</h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-1">Send a Message</h2>
        </div>
      </div>
      <div className="flex flex-col items-center bg-white p-4 sm:p-6 md:p-10 pt-0">
        {/* Contact Form Section */}
        <div className="w-full max-w-5xl">
          <div className="flex flex-col md:flex-row w-full gap-y-6 md:gap-x-24">
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row w-full md:gap-x-10">
                {/* Form Container */}
                <form className="flex-1 space-y-4">
                  <div className="flex flex-col w-full">
                    <label className="block text-gray-900 mb-1 text-left">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-400 rounded focus:outline-none"
                      placeholder="Enter Full Name"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block text-gray-900 mb-1 text-left">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-400 rounded focus:outline-none"
                      placeholder="Enter Phone Number"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block text-gray-900 mb-1 text-left">Email Address</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-400 rounded focus:outline-none"
                      placeholder="Enter Email Address"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block text-gray-900 mb-1 text-left">Message</label>
                    <textarea
                      className="w-full p-2 border border-gray-400 rounded h-24 focus:outline-none"
                      placeholder="Enter Message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-teal-600 text-black px-4 py-2 rounded-full flex items-center border border-black hover:bg-teal-700"
                  >
                    Send Message
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </form>
                {/* Image Container */}
                <div className="flex-1 flex justify-center items-stretch mt-6 md:mt-0 md:pl-4">
                  <img
                    src="/contact/contact1.jpg"
                    alt="Support Agent"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Contact Design Section */}
          <div className="flex justify-center bg-pink-100 p-2 sm:p-4 mt-6 rounded-lg w-full">
            <div className="flex w-full max-w-3xl mx-auto items-center justify-between flex-col md:flex-row gap-y-2 md:gap-y-0 md:gap-x-8 h-auto md:h-20">
              <div className="flex items-center bg-green-400 p-2 rounded-lg w-full md:w-auto mb-1 md:mb-0 justify-center md:justify-start h-14">
                <span className="mr-2">📞</span>
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <p className="text-xs">+947812347650</p>
                </div>
              </div>
              <div className="flex items-center bg-pink-400 p-2 rounded-lg w-full md:w-auto mb-1 md:mb-0 justify-center md:justify-center h-14">
                <span className="mr-2">📧</span>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-xs">hello@onlineschool.com</p>
                </div>
              </div>
              <div className="flex items-center bg-purple-400 p-2 rounded-lg w-full md:w-auto justify-center md:justify-end h-14">
                <span className="mr-2">💬</span>
                <div>
                  <p className="font-semibold text-sm">Live Chat</p>
                  <p className="text-xs">Open Live Chat</p>
                </div>
              </div>
            </div>
          </div>
          <FaqComponent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;