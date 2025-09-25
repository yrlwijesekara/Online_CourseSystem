import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import PopularCourses from '../components/PopularCourses';
import BestTalents from '../components/BestTalents';
import ReviewStudents from '../components/ReviewStudents';
import Footer from '../components/Footer';
import { ArrowUpRight } from 'lucide-react';
import CourseDetails from './CourseDetails';

const CoursePage = ({ navigateTo }) => {
  // State to track the active filter category
  const [activeFilter, setActiveFilter] = useState('All Categories');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  
  // List of all categories for the filter
  const categories = [
    { name: 'All Categories', icon: '🏷️' },
    { name: 'Development', icon: '💻' },
    { name: 'UI/UX Design', icon: '🎨' },
    { name: 'Project Management', icon: '📊' },
    { name: 'Accounting', icon: '💰' },
    { name: 'Marketing', icon: '📈' },
    { name: 'Programming', icon: '⌨️' },
    { name: 'Design', icon: '🎨' },
    { name: 'Business', icon: '💼' },
    { name: 'Photography', icon: '📸' },
    { name: 'Music', icon: '🎵' },
    { name: 'Health', icon: '🏥' }
  ];

  // Function to handle filter changes
  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      
      // Add auth header if token exists (optional for public course viewing)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:3001/api/courses', {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const coursesData = await response.json();
      
      // Transform API data to match frontend format
      const transformedCourses = coursesData.map(course => ({
        id: course.id,
        title: course.title,
        category: course.category || 'General',
        price: course.priceCents / 100, // Convert cents to dollars
        duration: course.duration || '3hr 30min', // Default duration if not provided
        lectures: course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 15, // Count lessons
        image: course.coverImageUrl || "/PopularCourses/p1.png", // Use cover image or default
        description: course.description,
        difficulty: course.difficulty,
        instructor: course.instructor?.name || 'Unknown Instructor'
      }));
      
      setAllCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Static fallback courses in case API fails
  const fallbackCourses = [
    {
      id: 1,
      title: "HTML, CSS, and JavaScript",
      category: "Development",
      price: 190.00,
      duration: "4hr 35min",
      lectures: 30,
      image: "/PopularCourses/p1.png",
    },
    {
      id: 2,
      title: "Stakeholders Management",
      category: "Project Management",
      price: 160.00,
      duration: "2hr 30min",
      lectures: 20,
      image: "/PopularCourses/p2.png",
    },
    {
      id: 3,
      title: "Google Ads & PPC Campaigns",
      category: "Marketing",
      price: 140.00,
      duration: "3hr 35min",
      lectures: 25,
      image: "/PopularCourses/p3.png",
    }
  ];

  const handleViewCourseDetails = (courseId) => {
    setSelectedCourseId(courseId);
    setShowCourseDetails(true);
  };

  const handleCloseCourseDetails = () => {
    setShowCourseDetails(false);
    setSelectedCourseId(null);
  };

  // Filtered courses based on selected category
  const filteredCourses = activeFilter === 'All Categories' 
    ? allCourses 
    : allCourses.filter(course => course.category === activeFilter);

  if (showCourseDetails && selectedCourseId) {
    return (
      <CourseDetails 
        courseId={selectedCourseId}
        onClose={handleCloseCourseDetails}
        navigateTo={navigateTo}
      />
    );
  }

  return (
    <>
      <div className="course-page">
          <Navbar navigateTo={navigateTo} currentPage="course" />

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
                                  className="w-auto h-auto object-cover" />
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
                                          <path d="M10 5V10L12.5 12.5" stroke="#4E5255" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10Z" stroke="#4E5255" strokeWidth="1.5" />
                                      </svg>
                                  </div>
                                  <span className="text-[14px] md:text-[16px] text-[#4E5255]">4hr 35min</span>
                              </div>

                              <div className="flex items-center">
                                  <div className="mr-2">
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="#4E5255" strokeWidth="1.5" />
                                      </svg>
                                  </div>
                                  <span className="text-[14px] md:text-[16px] text-[#4E5255]">30 lectures</span>
                              </div>
                          </div>

                          {/* Divider */}
                          <div className="h-[1px] bg-black my-4 md:my-8"></div>

                          {/* Price and action button */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                              <div className="text-[24px] md:text-[32px] font-semibold text-green-600 md:text-[#011813]">Free Course</div>

                              <div className="relative w-full sm:w-auto">
                                  <button 
                                      onClick={() => handleViewCourseDetails(allCourses[0]?.id)}
                                      className="group w-full sm:w-auto flex items-center justify-center sm:justify-start border border-black rounded-full pl-5 pr-12 py-2 md:py-3 relative hover:bg-[#011813] hover:text-white transition-all duration-300"
                                  >
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


          {/* All Courses Section */}
          <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-12">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Explore Our All Courses
                      </h1>
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                      {categories.map((category) => (
                          <button
                              key={category.name}
                              onClick={() => handleFilterChange(category.name)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === category.name
                                      ? 'bg-green-500 text-white shadow-lg'
                                      : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600'}`}
                          >
                              <span className="mr-2">{category.icon}</span>
                              {category.name}
                          </button>
                      ))}
                  </div>

                  {/* Loading State */}
                  {loading && (
                      <div className="text-center py-12">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                          <p className="mt-4 text-gray-600">Loading courses...</p>
                      </div>
                  )}

                  {/* Error State */}
                  {error && !loading && (
                      <div className="text-center py-12">
                          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                              <p className="font-medium">Error loading courses</p>
                              <p className="text-sm mt-1">{error}</p>
                              <button 
                                  onClick={fetchCourses}
                                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                              >
                                  Try Again
                              </button>
                          </div>
                      </div>
                  )}

                  {/* Course Grid - Showing filtered courses */}
                  {!loading && !error && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                          {(() => {
                              const coursesToShow = allCourses.length > 0 ? allCourses : fallbackCourses;
                              const filteredCourses = coursesToShow.filter(
                                  course => activeFilter === 'All Categories' || course.category === activeFilter
                              );

                              if (filteredCourses.length === 0) {
                                  return (
                                      <div className="col-span-full text-center py-12">
                                          <p className="text-gray-600 text-lg">No courses found for this category. Try another filter.</p>
                                      </div>
                                  );
                              }

                              return filteredCourses.map((course) => (
                              <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                  {/* Course Image */}
                                  <div className="h-48 w-full relative flex items-center justify-center overflow-hidden">
                                      <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
                                  </div>

                                  {/* Course Details */}
                                  <div className="p-6">
                                      <div className="flex items-center mb-2">
                                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                              {course.category}
                                          </span>
                                      </div>

                                      <h4 className="font-bold text-gray-900 text-lg mb-4 leading-tight">
                                          {course.title}
                                      </h4>

                                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                          <div className="flex items-center">
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                                  <path d="M10 5V10L12.5 12.5" stroke="#4E5255" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10Z" stroke="#4E5255" strokeWidth="1.5" />
                                              </svg>
                                              <span>{course.duration}</span>
                                          </div>
                                          <div className="flex items-center">
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                                  <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="#4E5255" strokeWidth="1.5" />
                                              </svg>
                                              <span>{course.lectures} lectures</span>
                                          </div>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <button 
                                          onClick={() => handleViewCourseDetails(course.id)}
                                          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                        >
                                          View Details
                                        </button>
                                        <span className="text-2xl font-bold text-red-600">Free</span>
                                      </div>
                                  </div>
                              </div>
                          ));
                      })()}
                      </div>
                  )}

                  {/* Explore All Courses Button */}
                  <div className="text-center">
                      <button className="bg-white text-gray-900 border border-black px-8 py-4 rounded-full font-medium hover:bg-[#011813] hover:text-white transition-colors duration-200 inline-flex items-center group">
                          <span className="group-hover:text-green-500">View More Courses</span>
                          <span className="ml-2 bg-[#011813] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                              <ArrowUpRight size={16} color="black" className="transform transition-transform group-hover:translate-x-0.5" />
                          </span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <BestTalents />
      <ReviewStudents />
      <Footer />
    </>
  );
};

export default CoursePage;
