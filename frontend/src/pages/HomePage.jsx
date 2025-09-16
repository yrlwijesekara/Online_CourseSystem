import React from 'react';
import Navbar from '../components/NavBar';
import PopularCourses from '../components/PopularCourses';
import BestTalents from '../components/BestTalents';
import ReviewStudents from '../components/ReviewStudents';
import Footer from '../components/Footer';
import { ArrowUpRight } from 'lucide-react';

const HomePage = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar navigateTo={navigateTo} currentPage="home" />

      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] bg-gradient-to-r from-green-100 to-pink-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 mt-10 lg:mt-0 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Elevate Your Skills with Online Learning
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Access world-class courses taught by industry experts. Learn at your own pace and 
                advance your career from anywhere in the world.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <button className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all">
                  <span>Get Started</span>
                  <ArrowUpRight size={18} />
                </button>
                <button 
                  className="flex items-center space-x-2 border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all"
                  onClick={() => navigateTo && navigateTo('course')}
                >
                  <span>Browse Courses</span>
                </button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">100+</p>
                  <p className="text-gray-600">Online Courses</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">50+</p>
                  <p className="text-gray-600">Expert Instructors</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">25k+</p>
                  <p className="text-gray-600">Active Students</p>
                </div>
              </div>
            </div>
            
            {/* Right Content - Image */}
            <div className="w-full lg:w-1/2 lg:pl-8">
              <img 
                src="/course/html.png" 
                alt="Online Learning" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <PopularCourses />

      {/* Best Talents Section */}
      <BestTalents />

      {/* Student Reviews Section */}
      <ReviewStudents />

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-100 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with us. Get access to all courses with a premium subscription.
          </p>
          <button 
            className="flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-full mx-auto hover:bg-gray-800 transition-all"
            onClick={() => navigateTo && navigateTo('course')}
          >
            <span>Enroll Now</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
