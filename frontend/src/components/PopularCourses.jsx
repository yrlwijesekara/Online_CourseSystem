import React, { useState } from 'react';
import { Clock, BookOpen, Users, Star } from 'lucide-react';

const PopularCourses = () => {
  const [activeFilter, setActiveFilter] = useState('All Categories');

  const categories = [
    'All Categories',
    'Development',
    'UI/UX Design',
    'Project Management',
    'Accounting',
    'Marketing'
  ];

  const courses = [
    {
      id: 1,
      title: "Financial Accounting Essentials",
      category: "Accounting",
      price: 140.00,
      duration: "2hr 35min",
      lectures: 20,
      image: "/PopularCourses/p1.png",
    },
    {
      id: 2,
      title: "Introduction to Design Systems",
      category: "UI/UX Design",
      price: 150.00,
      duration: "3hr 35min",
      lectures: 25,
  // ...existing code...
  image: "/PopularCourses/p2.png",
  isFree: true,
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      category: "Marketing",
      price: 140.00,
      duration: "2hr 35min",
      lectures: 20,
  // ...existing code...
  image: "/PopularCourses/p3.png",
    },
    {
      id: 4,
      title: "HTML, CSS, and Beyond",
      category: "Development",
      price: 180.00,
      duration: "4hr 35min",
      lectures: 30,
  // ...existing code...
  image: "/PopularCourses/p4.png",
    },
    {
      id: 5,
      title: "UI/UX Essentials for Engaging",
      category: "UI/UX Design",
      price: 160.00,
      duration: "3hr 35min",
      lectures: 25,
  // ...existing code...
  image: "/PopularCourses/p5.png",
    },
    {
      id: 6,
      title: "Effective Stakeholder Engagement",
      category: "Development",
      price: 160.00,
      duration: "2hr 35min",
      lectures: 20,
  // ...existing code...
  image: "/PopularCourses/p6.png",
//   rating: "4.9 (22) | 1.4K Students",
    }
  ];

  const filteredCourses = activeFilter === 'All Categories' 
    ? courses 
    : courses.filter(course => course.category === activeFilter);

  return (
    <div className="min-h-screen py-8 px-4"style={{ backgroundColor: '#F8F8F8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our Popular Courses
          </h1>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600'
                }`}
              >
                {category === 'All Categories' && (
                  <span className="mr-2">🏷️</span>
                )}
                {category === 'Development' && (
                  <span className="mr-2">💻</span>
                )}
                {category === 'UI/UX Design' && (
                  <span className="mr-2">🎨</span>
                )}
                {category === 'Project Management' && (
                  <span className="mr-2">📊</span>
                )}
                {category === 'Accounting' && (
                  <span className="mr-2">💰</span>
                )}
                {category === 'Marketing' && (
                  <span className="mr-2">📈</span>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Course Image */}
              <div className="h-48 w-full relative flex items-center justify-center overflow-hidden">
                <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
                {course.rating && (
                  <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                )}
                {course.isFree && (
                  <span className="absolute bottom-2 left-2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    FREE COURSE
                  </span>
                )}
              </div>

              {/* Course Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                  <span className="text-2xl font-bold text-green-500">
                    ${course.price.toFixed(2)}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-lg mb-4 leading-tight">
                  {course.title}
                </h4>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.lectures} lectures</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Courses Button */}
        <div className="text-center">
          <button className="bg-white text-gray-900 border border-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200 inline-flex items-center">
            Explore All Courses
            <span className="ml-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;