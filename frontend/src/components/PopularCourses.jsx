import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Users, Star } from 'lucide-react';

const PopularCourses = () => {
  const [activeFilter, setActiveFilter] = useState('All Categories');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    'All Categories',
    'Development',
    'UI/UX Design',
    'Project Management',
    'Accounting',
    'Marketing'
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3001/api/courses?limit=6&sort=createdAt_desc');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message || 'Error fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = activeFilter === 'All Categories'
    ? courses
    : courses.filter(course => course.category === activeFilter);

  return (
    <div className="min-h-screen py-4 px-4" style={{ backgroundColor: '#F8F8F8' }}>
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
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Course Image */}
                <div className="h-48 w-full relative flex items-center justify-center overflow-hidden">
                  <img src={course.coverImageUrl || '/PopularCourses/p1.png'} alt={course.title} className="object-cover w-full h-full" />
                  {/* Optionally show rating or free badge if available */}
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
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-4 leading-tight">
                    {course.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.estimatedDuration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{course.modules ? course.modules.length : 0} modules</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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