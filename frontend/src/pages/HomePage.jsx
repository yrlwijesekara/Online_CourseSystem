import React from 'react';
import Navbar from '../components/NavBar';
import PopularCourses from '../components/PopularCourses';
import BestTalents from '../components/BestTalents';
import ReviewStudents from '../components/ReviewStudents';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { ArrowUpRight } from 'lucide-react';
import ChosenCourses from '../components/ChosenCourses';

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
                Best Courses to Expand Your Digital Abilities
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Explore courses that expand your digital abilities, covering key areas like data analytics, design, and marketing for career growth and innovation.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                {/* <button className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all">
                  <span>Get Started</span>
                  <ArrowUpRight size={18} />
                </button> */}
                <button 
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all"
                  onClick={() => navigateTo && navigateTo('course')}
                >
                  <span>Explore Courses</span>
                </button>
              </div>
              
              {/* Stats */}
              {/* <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
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
              </div> */}
            </div>
            
            {/* Right Content - Image */}
            <div className="w-full lg:w-1/2 lg:pl-8">
              <img 
                src="/homeImage/home1.png" 
                alt="Online Learning" 
                className="rounded-xl  max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <ChosenCourses/>

      {/* Popular Courses Section */}
      <PopularCourses />

      {/* Best Talents Section */}
      <BestTalents />

      {/* Student Reviews Section */}
      <ReviewStudents />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;