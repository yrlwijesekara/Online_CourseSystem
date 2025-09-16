import React from 'react';
import Navbar from '../components/NavBar';
import PopularCourses from '../components/PopularCourses';
import { ArrowUpRight } from 'lucide-react';

const CoursePage = () => {
  return (
    <div className="course-page">
      <Navbar />
      
      {/* Background with gradient effect */}
      <div className="relative w-full min-h-screen md:h-[848px] overflow-hidden bg-gradient-to-r from-green-100 to-pink-100 pb-10 md:pb-0">
        {/* Blur effects - visible on medium screens and above */}
        <div className="hidden md:block absolute left-[42%] right-[0%] top-[-5%] bottom-[85%] bg-white/85 filter blur-[98px]"></div>
        <div className="hidden md:block absolute left-[28%] right-[39%] top-[-5%] bottom-[89%] bg-white/85 filter blur-[98px]"></div>
        <div className="hidden md:block absolute left-[-6%] right-[48%] top-[-5%] bottom-[85%] bg-white/85 filter blur-[98px]"></div>
        {/* Container for content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb navigation */}
          <div className="pt-6 md:pt-12">
            <div className="text-[14px] md:text-[16px] flex items-center font-normal">
              <span className="text-[#011813]">Home</span>
              <span className="mx-2 text-[#011813]">/</span>
              <span className="text-[#011813]">Courses</span>
            </div>
          </div>
          
          {/* Section Title */}
          <div className="mt-8">
            <h1 className="text-2xl md:text-4xl font-semibold leading-[1.2] sm:leading-[1.2] md:leading-[1.2] lg:leading-[86px] text-[#011813] max-w-[830px]">
              We Offer an Outstanding Learning Experience
            </h1>
            
            {/* Dot pattern (simplified) */}
            <div className="hidden md:grid absolute right-0 top-[140px] grid-cols-6 grid-rows-3 gap-2">
              {[...Array(18)].map((_, index) => (
                <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
          
          {/* Course card section */}
          <div className="mt-8 md:mt-16 flex flex-col md:flex-row rounded-[24px]   p-4 md:p-6">
            {/* Left side - Course image */}
            <div className="w-full md:w-1/2 md:pr-6 relative mb-6 md:mb-0">
              <div className="relative h-64 md:h-full rounded-[16px] overflow-hidden">
                <div className="absolute inset-0 bg-black/10 "></div>
                <img 
                  src="/course/html.png" 
                  alt="HTML CSS JS Course" 
                  className="w-auto h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Right side - Course details */}
            <div className="w-full md:w-1/2 md:pl-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                {/* Category badge */}
                <div className="px-4 py-2 bg-[#F0F0F0] rounded-lg">
                  <span className="text-[#011813] font-medium">Development</span>
                </div>
                
                {/* Popular badge */}
                <div className="px-4 py-2 bg-black rounded-full flex items-center">
                  <div className="mr-2">
                    <span className="text-[#FD5133]">🔥</span>
                  </div>
                  <span className="text-white font-medium">Popular</span>
                </div>
              </div>
              
              {/* Course title and description */}
              <div className="mt-4 md:mt-8">
                <h2 className="text-[24px] md:text-[32px] font-semibold text-[#011813]">HTML, CSS, and JavaScript</h2>
                <p className="text-[14px] md:text-[16px] text-[#4E5255] mt-3 md:mt-4 max-w-[538px]">
                  Gain UI design mastery with hands-on expert mentorship, refining your skills 
                  through personalized guidance and feedback.
                </p>
              </div>
              
              {/* Course info */}
              <div className="mt-4 md:mt-8 flex flex-wrap gap-4 md:gap-0 md:justify-between">
                <div className="flex items-center">
                  <div className="mr-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 5V10L12.5 12.5" stroke="#4E5255" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10Z" stroke="#4E5255" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span className="text-[14px] md:text-[16px] text-[#4E5255]">4hr 35min</span>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="#4E5255" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span className="text-[14px] md:text-[16px] text-[#4E5255]">30 lectures</span>
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-[1px] bg-black my-4 md:my-8"></div>
              
              {/* Price and action button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="text-[24px] md:text-[32px] font-semibold text-green-600 md:text-[#011813]">$190.00</div>
                
                <div className="relative w-full sm:w-auto">
                  <button className="group w-full sm:w-auto flex items-center justify-center sm:justify-start border border-black rounded-full pl-5 pr-12 py-2 md:py-3 relative hover:bg-[#011813] hover:text-white transition-all duration-300">
                    <span className="text-[#011813] font-medium group-hover:text-green-600">View Details</span>
                    <div className="absolute right-0 top-0 bottom-0 bg-[#011813] rounded-full w-10 h-10 flex items-center justify-center">
                      <ArrowUpRight size={16} color="black" className="transform transition-transform group-hover:translate-x-0.5 " />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  <PopularCourses />
};

export default CoursePage;
