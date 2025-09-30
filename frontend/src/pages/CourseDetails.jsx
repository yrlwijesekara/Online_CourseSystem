import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, User, Play, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const CourseDetails = ({ courseId, onClose, navigateTo }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null); // { message, type } for notifications
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState({ text: '', file: null });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showLearningContent, setShowLearningContent] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      checkEnrollmentStatus();
    }
  }, [courseId]);
  
  // Reset forms when modals are closed
  useEffect(() => {
    if (!selectedAssignment) {
      setAssignmentSubmission({ text: '', file: null });
    }
  }, [selectedAssignment]);
  
  useEffect(() => {
    if (!selectedQuiz) {
      setQuizAnswers({});
    }
  }, [selectedQuiz]);

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
      
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle assignment submission
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to submit assignments');
      }
      
      if (!assignmentSubmission.text && !assignmentSubmission.file) {
        throw new Error('Please provide either text or a file submission');
      }
      
      const formData = new FormData();
      formData.append('text', assignmentSubmission.text);
      if (assignmentSubmission.file) {
        formData.append('file', assignmentSubmission.file);
      }
      
      const response = await fetch(`http://localhost:3001/api/assignment/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit assignment');
      }
      
      setToast({
        message: 'Assignment submitted successfully!',
        type: 'success'
      });
      
      // Reset form and close modal
      setAssignmentSubmission({ text: '', file: null });
      setSelectedAssignment(null);
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setToast({
        message: error.message || 'Failed to submit assignment',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  };
  
  // Handle quiz submission
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to submit quizzes');
      }
      
      // Validate that all questions have answers
      const questionsCount = selectedQuiz.questions?.length || 0;
      const answersCount = Object.keys(quizAnswers).length;
      
      if (answersCount < questionsCount) {
        throw new Error('Please answer all questions before submitting');
      }
      
      const response = await fetch(`http://localhost:3001/api/quiz/${selectedQuiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: quizAnswers })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }
      
      const result = await response.json();
      
      setToast({
        message: `Quiz submitted successfully! You scored ${result.score}/${result.total}.`,
        type: 'success'
      });
      
      // Reset and close modal
      setQuizAnswers({});
      setSelectedQuiz(null);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setToast({
        message: error.message || 'Failed to submit quiz',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  };
  
  // Handle answer changes in quiz
  const handleQuizAnswerChange = (questionId, value, type) => {
    if (type === 'MCQ') {
      setQuizAnswers({ ...quizAnswers, [questionId]: value });
    } else if (type === 'MULTISELECT') {
      const currentAnswers = quizAnswers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(answer => answer !== value)
        : [...currentAnswers, value];
        
      setQuizAnswers({ ...quizAnswers, [questionId]: newAnswers });
    } else { // TEXT
      setQuizAnswers({ ...quizAnswers, [questionId]: value });
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // User is not logged in, so they are not enrolled
        setIsEnrolled(false);
        return;
      }
      
      // Fetch user's enrollments
      const response = await fetch('http://localhost:3001/api/enrollment/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // If the status is 401, the user is likely not logged in
        if (response.status === 401) {
          console.log('User not authenticated for enrollment check');
          setIsEnrolled(false);
          return;
        }
        
        // For other errors
        throw new Error(`Failed to fetch enrollment status: ${response.status} ${response.statusText}`);
      }
      
      const enrollments = await response.json();
      
      // Check if user is enrolled in this course
      const isUserEnrolled = enrollments.some(
        enrollment => enrollment.courseId === Number(courseId)
      );
      
      setIsEnrolled(isUserEnrolled);
      console.log('Enrollment status:', isUserEnrolled ? 'Enrolled' : 'Not enrolled');
      
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      // If there's an error, assume user is not enrolled
      setIsEnrolled(false);
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

      // Enroll user in the course
      console.log('Enrolling in course:', courseId);
      
      const response = await fetch(`http://localhost:3001/api/enrollment/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Try to get the error message as JSON
        let errorMessage = 'Failed to enroll in course';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, get the status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const enrollmentData = await response.json();
      console.log('Enrollment successful:', enrollmentData);
      
      // After successful enrollment:
      setIsEnrolled(true);
      
      // Show success message
      setToast({
        message: 'You have successfully enrolled in this course!',
        type: 'success'
      });
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null);
      }, 5000);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setToast({
        message: `Enrollment failed: ${error.message}`,
        type: 'error'
      });
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null);
      }, 5000);
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
      {/* Add custom styles for mobile responsiveness */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>
      
      <Navbar navigateTo={navigateTo} />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 
          'bg-red-100 border-l-4 border-red-500'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              toast.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="ml-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Course Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="w-full h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden mb-4 sm:mb-6">
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
              <nav className="flex space-x-8 overflow-x-auto scrollbar-hide whitespace-nowrap">
                {['overview', 'curriculum', 'instructor', 'assignments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ minWidth: '110px' }}
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
              
              {activeTab === 'assignments' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Assignments and Quizzes</h3>
                  
                  {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-6">
                      {course.modules.map((module) => (
                        <div key={module.id}>
                          <h4 className="font-medium text-lg text-gray-800 mb-3">{module.title}</h4>
                          
                          {module.lessons && module.lessons.length > 0 ? (
                            <div className="space-y-4">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="border rounded-lg">
                                  <div className="p-4 bg-gray-50 border-b">
                                    <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                                  </div>
                                  
                                  {/* Assignments */}
                                  {lesson.assignments && lesson.assignments.length > 0 ? (
                                    <div className="p-4 border-b">
                                      <h6 className="font-medium text-gray-700 mb-3">Assignments</h6>
                                      <div className="space-y-3">
                                        {lesson.assignments.map((assignment) => (
                                          <div key={assignment.id} className="p-3 bg-white border rounded-md">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                              <div className="flex items-start sm:items-center">
                                                <div className="p-2 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                  </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                  <h6 className="font-medium text-sm sm:text-base">{assignment.title}</h6>
                                                  {assignment.dueDate && (
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                              <button 
                                                onClick={() => setSelectedAssignment(assignment)}
                                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors self-start sm:self-center flex-shrink-0"
                                              >
                                                View
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-4 border-b text-gray-500 text-sm">
                                      No assignments available for this lesson.
                                    </div>
                                  )}
                                  
                                  {/* Quizzes */}
                                  {lesson.quizzes && lesson.quizzes.length > 0 ? (
                                    <div className="p-4">
                                      <h6 className="font-medium text-gray-700 mb-3">Quizzes</h6>
                                      <div className="space-y-3">
                                        {lesson.quizzes.map((quiz) => (
                                          <div key={quiz.id} className="p-3 bg-white border rounded-md">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                              <div className="flex items-start sm:items-center">
                                                <div className="p-2 bg-green-100 rounded-full mr-3 flex-shrink-0">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                                    <path d="M9 11l3 3L22 4"></path>
                                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                  </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                  <h6 className="font-medium text-sm sm:text-base">{quiz.title}</h6>
                                                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    {quiz.questions?.length || 0} questions • {quiz.totalMarks} marks
                                                  </p>
                                                </div>
                                              </div>
                                              <button 
                                                onClick={() => setSelectedQuiz(quiz)}
                                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors self-start sm:self-center flex-shrink-0"
                                              >
                                                Take Quiz
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-4 text-gray-500 text-sm">
                                      No quizzes available for this lesson.
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No lessons available in this module.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No assignments or quizzes available for this course yet.</p>
                  )}
                </div>
              )}


            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Free Course
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Get lifetime access to this course</p>
                </div>

                {!isEnrolled ? (
                  <button 
                    onClick={handleEnroll}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-4"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center">
                      <CheckCircle size={18} className="mr-2" />
                      Enrolled
                    </div>
                    <button 
                      onClick={() => {
                        setShowLearningContent(true);
                        setActiveTab('assignments');
                        // Find the first assignment or quiz
                        let found = false;
                        if (course?.modules?.length) {
                          for (const module of course.modules) {
                            if (module.lessons?.length) {
                              for (const lesson of module.lessons) {
                                if (!found && lesson.assignments && lesson.assignments.length > 0) {
                                  setSelectedAssignment(lesson.assignments[0]);
                                  found = true;
                                  break;
                                }
                                if (!found && lesson.quizzes && lesson.quizzes.length > 0) {
                                  setSelectedQuiz(lesson.quizzes[0]);
                                  found = true;
                                  break;
                                }
                              }
                            }
                            if (found) break;
                          }
                        }
                        setToast({
                          message: found
                            ? 'Learning content is now available! Complete the form to get started.'
                            : 'Learning content is now available! Check the Assignments tab.',
                          type: 'success'
                        });
                        setTimeout(() => {
                          setToast(null);
                        }, 3000);
                      }}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Play size={18} className="mr-2" />
                      Start Learning
                    </button>
                    {!showLearningContent && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Click "Start Learning" to access assignments and quizzes
                      </p>
                    )}
                  </div>
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

      {/* Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 pr-4">{selectedAssignment.title}</h3>
                <button 
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {selectedAssignment.dueDate && (
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()} {new Date(selectedAssignment.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              )}
            </div>
            <div className="p-4 sm:p-6">
              <div className="prose max-w-none">
                <h4 className="font-medium text-gray-800 mb-3">Instructions</h4>
                <p className="text-gray-600 whitespace-pre-line mb-6">{selectedAssignment.description}</p>
                
                {selectedAssignment.contents && (
                  <div className="bg-gray-50 border rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Additional Resources</h5>
                    <pre className="text-sm text-gray-600 overflow-auto">
                      {typeof selectedAssignment.contents === 'string' 
                        ? selectedAssignment.contents 
                        : JSON.stringify(selectedAssignment.contents, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              {isEnrolled && (
                <div className="mt-8 border-t pt-6">
                  <h4 className="font-medium text-gray-800 mb-3">Submit Your Assignment</h4>
                  <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Answer
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        rows={5}
                        placeholder="Type your answer here..."
                        value={assignmentSubmission.text}
                        onChange={(e) => setAssignmentSubmission({ ...assignmentSubmission, text: e.target.value })}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload File (optional)
                      </label>
                      <input 
                        type="file" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setAssignmentSubmission({ 
                          ...assignmentSubmission, 
                          file: e.target.files[0] 
                        })}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className={`flex items-center justify-center ${
                        submitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                      } text-white px-4 py-2 rounded-md transition-colors`}
                    >
                      {submitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Submitting...
                        </>
                      ) : 'Submit Assignment'}
                    </button>
                  </form>
                </div>
              )}
              
              {!isEnrolled && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700">
                    You need to enroll in this course to submit assignments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 pr-4">{selectedQuiz.title}</h3>
                <button 
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-2 sm:gap-4">
                <span>{selectedQuiz.questions?.length || 0} Questions</span>
                <span>{selectedQuiz.totalMarks || 0} Total Marks</span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {!isEnrolled ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700">
                    You need to enroll in this course to take quizzes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Quiz Instructions</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>Read each question carefully before answering.</li>
                      <li>Once you submit the quiz, you cannot change your answers.</li>
                      <li>For multiple-choice questions, select the best answer.</li>
                      <li>Complete all questions to get your final score.</li>
                    </ul>
                  </div>
                  
                  <form onSubmit={handleQuizSubmit} className="space-y-8">
                    {selectedQuiz.questions?.map((question, index) => (
                      <div key={question.id} className="border rounded-md p-4">
                        <h5 className="font-medium text-gray-800 mb-2">
                          Question {index + 1}: {question.text}
                        </h5>
                        <p className="text-sm text-gray-500 mb-3">{question.marks} mark{question.marks > 1 ? 's' : ''}</p>
                        
                        {question.type === 'MCQ' && (
                          <div className="space-y-2">
                            {JSON.parse(question.options || '[]').map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input 
                                  type="radio" 
                                  name={`question_${question.id}`} 
                                  id={`q${question.id}_opt${optIndex}`}
                                  className="mr-2"
                                  checked={quizAnswers[question.id] === option}
                                  onChange={() => handleQuizAnswerChange(question.id, option, 'MCQ')}
                                  required
                                />
                                <label htmlFor={`q${question.id}_opt${optIndex}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'MULTISELECT' && (
                          <div className="space-y-2">
                            {JSON.parse(question.options || '[]').map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  name={`question_${question.id}`} 
                                  id={`q${question.id}_opt${optIndex}`}
                                  className="mr-2"
                                  checked={(quizAnswers[question.id] || []).includes(option)}
                                  onChange={() => handleQuizAnswerChange(question.id, option, 'MULTISELECT')}
                                />
                                <label htmlFor={`q${question.id}_opt${optIndex}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'TEXT' && (
                          <textarea
                            name={`question_${question.id}`}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Type your answer here..."
                            value={quizAnswers[question.id] || ''}
                            onChange={(e) => handleQuizAnswerChange(question.id, e.target.value, 'TEXT')}
                            required
                          ></textarea>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      type="submit"
                      disabled={submitting}
                      className={`flex items-center justify-center ${
                        submitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                      } text-white px-6 py-2 rounded-md transition-colors`}
                    >
                      {submitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Submitting...
                        </>
                      ) : 'Submit Quiz'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
     
    </div>
  );
};

export default CourseDetails;