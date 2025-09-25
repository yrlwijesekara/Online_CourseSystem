import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, User, Play, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const CourseDetails = ({ courseId, onClose, navigateTo }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      const courseData = await response.json();
      setCourse(courseData);
      
      // Check if user is enrolled (you can add this logic later)
      // setIsEnrolled(checkEnrollmentStatus(courseData.id));
      
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login
        navigateTo('signin');
        return;
      }

      // Add enrollment logic here
      console.log('Enrolling in course:', courseId);
      // After successful enrollment:
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar navigateTo={navigateTo} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar navigateTo={navigateTo} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={fetchCourseDetails}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar navigateTo={navigateTo} />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar navigateTo={navigateTo} />
      
      

      {/* Course Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              <img 
                src={course.coverImageUrl || '/course/html.png'} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Title and Description */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category || 'General'}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.difficulty}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock size={24} className="mx-auto mb-2 text-gray-600" />
                <div className="font-semibold text-gray-900">{course.estimatedDuration || '4h 35m'}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen size={24} className="mx-auto mb-2 text-gray-600" />
                <div className="font-semibold text-gray-900">{course.modules?.length || 0}</div>
                <div className="text-sm text-gray-600">Modules</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Play size={24} className="mx-auto mb-2 text-gray-600" />
                <div className="font-semibold text-gray-900">
                  {course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Lessons</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <User size={24} className="mx-auto mb-2 text-gray-600" />
                <div className="font-semibold text-gray-900">{course.enrollments?.length || 0}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'curriculum', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Course Overview</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      {course.fullDescription || course.description}
                    </p>
                    
                    <h4 className="font-semibold mb-2">What you'll learn:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      {course.learningOutcomes ? (
                        course.learningOutcomes.split('\n').map((outcome, index) => (
                          <li key={index}>{outcome.trim()}</li>
                        ))
                      ) : (
                        <li>No learning outcomes specified for this course</li>
                      )}
                    </ul>

                    <h4 className="font-semibold mb-2 mt-6">Prerequisites:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      {course.prerequisites ? (
                        course.prerequisites.split('\n').map((prerequisite, index) => (
                          <li key={index}>{prerequisite.trim()}</li>
                        ))
                      ) : (
                        <li>No prerequisites specified for this course</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
                  {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-4">
                      {course.modules.map((module, index) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg">
                          <div className="p-4 bg-gray-50">
                            <h4 className="font-semibold">Module {index + 1}: {module.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.lessons?.length || 0} lessons
                            </p>
                          </div>
                          {module.lessons && (
                            <div className="p-4 space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center text-sm">
                                  <Play size={16} className="mr-3 text-gray-400" />
                                  <span className="flex-1">{lessonIndex + 1}. {lesson.title}</span>
                                  <span className="text-gray-500">{lesson.durationSec ? `${Math.ceil(lesson.durationSec / 60)} min` : '5 min'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No curriculum available yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">About the Instructor</h3>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={course.instructor?.avatarUrl || '/bestTalent/Adam.png'} 
                      alt={course.instructor?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{course.instructor?.name || 'Unknown Instructor'}</h4>
                      <p className="text-gray-600 mt-2">
                        {course.instructor?.bio || 'Experienced instructor with years of expertise in the field.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    Free Course
                  </div>
                  <p className="text-gray-600">Get lifetime access to this course</p>
                </div>

                {!isEnrolled ? (
                  <button 
                    onClick={handleEnroll}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-4"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold mb-4 flex items-center justify-center">
                    <CheckCircle size={20} className="mr-2" />
                    Enrolled
                  </button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{course.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{course.category || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{course.language || 'English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate:</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetails;