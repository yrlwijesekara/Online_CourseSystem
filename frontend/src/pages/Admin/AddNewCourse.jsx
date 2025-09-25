import { useState } from 'react';
import { X, Plus, Trash2, BookOpen, FileText, HelpCircle } from 'lucide-react';

export default function AddNewCourse({ onClose, onCourseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    fullDescription: '',
    difficulty: 'BEGINNER',
    estimatedDuration: '',
    prerequisites: '',
    learningOutcomes: '',
    language: 'English',
    level: 'BEGINNER',
  });
  
  const [modules, setModules] = useState([
    {
      title: 'Module 1',
      order: 1,
      lessons: [
        {
          title: 'Introduction',
          contentType: 'ARTICLE',
          text: '',
          order: 1,
          assignments: [],
          quizzes: []
        }
      ]
    }
  ]);
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && ['image/png', 'image/jpeg', 'image/gif'].includes(files[0].type)) {
      setThumbnailFile(files[0]);
    }
  };
  
  const handleContentDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setContentFile(files[0]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleFileInputChange = (e, type) => {
    const files = e.target.files;
    if (files.length > 0) {
      if (type === 'thumbnail') {
        setThumbnailFile(files[0]);
      } else {
        setContentFile(files[0]);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Prepare course data for API
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fullDescription: formData.fullDescription,
        difficulty: formData.difficulty,
        estimatedDuration: formData.estimatedDuration,
        prerequisites: formData.prerequisites,
        learningOutcomes: formData.learningOutcomes,
        language: formData.language,
        coverImageUrl: thumbnailFile ? URL.createObjectURL(thumbnailFile) : null, // In production, upload to cloud storage first
        isPublished: false, // Set as pending by default, requires admin approval
        modules: modules
      };

      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      const newCourse = await response.json();
      console.log('Course created successfully:', newCourse);
      
      // Call the callback to refresh the course list
      if (onCourseAdded) {
        onCourseAdded(newCourse);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Category and Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Duration and Language Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 4h 30m"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Description Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Course Description</h3>
            
            {/* Short Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                placeholder="Brief description of the course"
                required
              />
            </div>

            {/* Full Description */}
            <div>
              <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                placeholder="Detailed description of what students will learn..."
              />
            </div>

            {/* Learning Outcomes */}
            <div>
              <label htmlFor="learningOutcomes" className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes
              </label>
              <textarea
                id="learningOutcomes"
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                placeholder="What will students learn by the end of this course? (One per line)"
              />
            </div>

            {/* Prerequisites */}
            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                placeholder="What should students know before taking this course?"
              />
            </div>
          </div>

          {/* Course Structure Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Course Structure</h3>
            
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Title
                      </label>
                      <input 
                        type="text"
                        value={module.title}
                        onChange={e => {
                          const newModules = [...modules];
                          newModules[moduleIndex].title = e.target.value;
                          setModules(newModules);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter module title"
                      />
                    </div>
                    <button 
                      type="button"
                      className="ml-4 p-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (modules.length > 1) {
                          const newModules = modules.filter((_, i) => i !== moduleIndex);
                          setModules(newModules);
                        } else {
                          alert('Course needs at least one module');
                        }
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="pl-4 border-l-2 border-gray-200 space-y-4">
                    <h4 className="font-medium text-gray-800">Lessons</h4>
                    
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lesson Title
                            </label>
                            <input 
                              type="text"
                              value={lesson.title}
                              onChange={e => {
                                const newModules = [...modules];
                                newModules[moduleIndex].lessons[lessonIndex].title = e.target.value;
                                setModules(newModules);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Enter lesson title"
                            />
                          </div>
                          <button 
                            type="button"
                            className="ml-4 p-2 text-red-500 hover:text-red-700"
                            onClick={() => {
                              if (module.lessons.length > 1) {
                                const newModules = [...modules];
                                newModules[moduleIndex].lessons = module.lessons.filter((_, i) => i !== lessonIndex);
                                setModules(newModules);
                              } else {
                                alert('Module needs at least one lesson');
                              }
                            }}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        {/* Content Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Type
                          </label>
                          <select
                            value={lesson.contentType}
                            onChange={e => {
                              const newModules = [...modules];
                              newModules[moduleIndex].lessons[lessonIndex].contentType = e.target.value;
                              setModules(newModules);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="ARTICLE">Article</option>
                            <option value="VIDEO">Video</option>
                            <option value="PDF">PDF</option>
                          </select>
                        </div>

                        {/* Lesson Content */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lesson Content
                          </label>
                          <textarea
                            value={lesson.text}
                            onChange={e => {
                              const newModules = [...modules];
                              newModules[moduleIndex].lessons[lessonIndex].text = e.target.value;
                              setModules(newModules);
                            }}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                            placeholder="Enter lesson content..."
                          />
                        </div>
                        
                        {/* Assignments */}
                        <div className="pl-4 border-l-2 border-blue-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-blue-800 flex items-center">
                              <FileText size={18} className="mr-2 text-blue-600" />
                              Assignments
                            </h5>
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                              onClick={() => {
                                const newModules = [...modules];
                                if (!newModules[moduleIndex].lessons[lessonIndex].assignments) {
                                  newModules[moduleIndex].lessons[lessonIndex].assignments = [];
                                }
                                newModules[moduleIndex].lessons[lessonIndex].assignments.push({
                                  title: `Assignment ${(lesson.assignments?.length || 0) + 1}`,
                                  description: '',
                                  dueDate: ''
                                });
                                setModules(newModules);
                              }}
                            >
                              <Plus size={16} className="mr-1" /> Add Assignment
                            </button>
                          </div>
                          
                          {lesson.assignments && lesson.assignments.length > 0 ? (
                            <div className="space-y-3">
                              {lesson.assignments.map((assignment, assignmentIndex) => (
                                <div key={assignmentIndex} className="bg-white p-3 rounded border shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <input
                                      type="text"
                                      value={assignment.title}
                                      onChange={e => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].assignments[assignmentIndex].title = e.target.value;
                                        setModules(newModules);
                                      }}
                                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      placeholder="Assignment title"
                                    />
                                    <button
                                      type="button"
                                      className="ml-2 text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].assignments = 
                                          lesson.assignments.filter((_, i) => i !== assignmentIndex);
                                        setModules(newModules);
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  
                                  <textarea
                                    value={assignment.description}
                                    onChange={e => {
                                      const newModules = [...modules];
                                      newModules[moduleIndex].lessons[lessonIndex].assignments[assignmentIndex].description = e.target.value;
                                      setModules(newModules);
                                    }}
                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-2"
                                    placeholder="Assignment description"
                                    rows={2}
                                  />
                                  
                                  <div className="flex items-center">
                                    <label className="text-xs text-gray-600 mr-2">Due Date:</label>
                                    <input
                                      type="date"
                                      value={assignment.dueDate}
                                      onChange={e => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].assignments[assignmentIndex].dueDate = e.target.value;
                                        setModules(newModules);
                                      }}
                                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No assignments yet. Add an assignment using the button above.</p>
                          )}
                        </div>
                        
                        {/* Quizzes */}
                        <div className="pl-4 border-l-2 border-green-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-green-800 flex items-center">
                              <HelpCircle size={18} className="mr-2 text-green-600" />
                              Quizzes
                            </h5>
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-800 flex items-center text-sm"
                              onClick={() => {
                                const newModules = [...modules];
                                if (!newModules[moduleIndex].lessons[lessonIndex].quizzes) {
                                  newModules[moduleIndex].lessons[lessonIndex].quizzes = [];
                                }
                                newModules[moduleIndex].lessons[lessonIndex].quizzes.push({
                                  title: `Quiz ${(lesson.quizzes?.length || 0) + 1}`,
                                  totalMarks: 10,
                                  questions: [
                                    {
                                      text: 'Sample question',
                                      type: 'MCQ',
                                      options: 'Option A, Option B, Option C',
                                      correct: 'Option A',
                                      marks: 1
                                    }
                                  ]
                                });
                                setModules(newModules);
                              }}
                            >
                              <Plus size={16} className="mr-1" /> Add Quiz
                            </button>
                          </div>
                          
                          {lesson.quizzes && lesson.quizzes.length > 0 ? (
                            <div className="space-y-3">
                              {lesson.quizzes.map((quiz, quizIndex) => (
                                <div key={quizIndex} className="bg-white p-3 rounded border shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <input
                                      type="text"
                                      value={quiz.title}
                                      onChange={e => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].quizzes[quizIndex].title = e.target.value;
                                        setModules(newModules);
                                      }}
                                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                      placeholder="Quiz title"
                                    />
                                    <button
                                      type="button"
                                      className="ml-2 text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].quizzes = 
                                          lesson.quizzes.filter((_, i) => i !== quizIndex);
                                        setModules(newModules);
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center mb-2">
                                    <label className="text-xs text-gray-600 mr-2">Total Marks:</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={quiz.totalMarks}
                                      onChange={e => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].quizzes[quizIndex].totalMarks = 
                                          parseInt(e.target.value) || 10;
                                        setModules(newModules);
                                      }}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-700">
                                      <span>Questions: {quiz.questions?.length || 0}</span>
                                      <button
                                        type="button"
                                        className="text-green-600 hover:text-green-800 text-xs"
                                        onClick={() => {
                                          const newModules = [...modules];
                                          if (!newModules[moduleIndex].lessons[lessonIndex].quizzes[quizIndex].questions) {
                                            newModules[moduleIndex].lessons[lessonIndex].quizzes[quizIndex].questions = [];
                                          }
                                          newModules[moduleIndex].lessons[lessonIndex].quizzes[quizIndex].questions.push({
                                            text: 'New question',
                                            type: 'MCQ',
                                            options: 'Option A, Option B, Option C',
                                            correct: 'Option A',
                                            marks: 1
                                          });
                                          setModules(newModules);
                                        }}
                                      >
                                        + Add Question
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No quizzes yet. Add a quiz using the button above.</p>
                          )}
                        </div>
                        
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded flex items-center text-sm hover:bg-gray-200"
                      onClick={() => {
                        const newModules = [...modules];
                        newModules[moduleIndex].lessons.push({
                          title: `Lesson ${module.lessons.length + 1}`,
                          contentType: 'ARTICLE',
                          text: '',
                          order: module.lessons.length + 1,
                          assignments: [],
                          quizzes: []
                        });
                        setModules(newModules);
                      }}
                    >
                      <Plus size={16} className="mr-1" /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg flex items-center hover:bg-red-100"
                onClick={() => {
                  setModules([...modules, {
                    title: `Module ${modules.length + 1}`,
                    order: modules.length + 1,
                    lessons: [{
                      title: 'New Lesson',
                      contentType: 'ARTICLE',
                      text: '',
                      order: 1,
                      assignments: [],
                      quizzes: []
                    }]
                  }]);
                }}
              >
                <Plus size={20} className="mr-2" /> Add Module
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Course Materials</h3>
            
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <div
                onDrop={handleThumbnailDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                {thumbnailFile ? (
                  <div className="flex items-center justify-center">
                    <span className="text-green-600 font-medium">{thumbnailFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drop thumbnail image here or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInputChange(e, 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Content Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Content
              </label>
              <div
                onDrop={handleContentDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                {contentFile ? (
                  <div className="flex items-center justify-center">
                    <span className="text-green-600 font-medium">{contentFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drop course content here or click to browse</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={(e) => handleFileInputChange(e, 'content')}
                      className="hidden"
                      id="content-upload"
                    />
                    <label
                      htmlFor="content-upload"
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-white rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            'Create Course'
          )}
        </button>
      </div>
    </div>
  </div>
);
}