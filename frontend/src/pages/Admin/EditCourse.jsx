import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EditCourse({ courseId, onClose, onCourseUpdated }) {
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
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch course data when component mounts
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

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
    const file = e.target.files[0];
    if (file) {
      if (type === 'thumbnail') {
        setThumbnailFile(file);
      } else if (type === 'content') {
        setContentFile(file);
      }
    }
  };

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course data');
      }

      const course = await response.json();
      
      // Populate form with existing data
      setFormData({
        title: course.title || '',
        category: course.category || '',
        description: course.description || '',
        fullDescription: course.fullDescription || '',
        difficulty: course.difficulty || 'BEGINNER',
        estimatedDuration: course.estimatedDuration || '',
        prerequisites: course.prerequisites || '',
        learningOutcomes: course.learningOutcomes || '',
        language: course.language || 'English',
        level: course.level || 'BEGINNER',
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('fullDescription', formData.fullDescription);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('estimatedDuration', formData.estimatedDuration);
      formDataToSend.append('prerequisites', formData.prerequisites);
      formDataToSend.append('learningOutcomes', formData.learningOutcomes);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('level', formData.level);
      
      // Add thumbnail file if selected
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }
      
      // Add content file if selected
      if (contentFile) {
        formDataToSend.append('content', contentFile);
      }

      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update course');
      }

      const updatedCourse = await response.json();
      console.log('Course updated successfully:', updatedCourse);
      
      // Call the callback to refresh the course list
      if (onCourseUpdated) {
        onCourseUpdated(updatedCourse);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error.message || 'Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading course data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
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
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}