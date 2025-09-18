import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddNewCourse({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
  });
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission with API call
    console.log('Form submitted:', { ...formData, thumbnailFile, contentFile });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4">
        {/* Header with title and close button */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter course description"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>
          
          {/* File upload section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Thumbnail upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Thumbnail
              </label>
              <div
                onDrop={handleThumbnailDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                
                <div className="flex items-center mb-2">
                  <label className="cursor-pointer bg-white px-3 py-1 rounded-md mr-2">
                    <span className="text-red-600 font-medium">Upload a file</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.gif"
                      onChange={(e) => handleFileInputChange(e, 'thumbnail')}
                    />
                  </label>
                  <span className="text-gray-600">or drag and drop</span>
                </div>
                
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                
                {thumbnailFile && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {thumbnailFile.name}
                  </div>
                )}
              </div>
            </div>
            
            {/* Content upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Content
              </label>
              <div
                onDrop={handleContentDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                
                <div className="flex items-center mb-2">
                  <label className="cursor-pointer bg-white px-3 py-1 rounded-md mr-2">
                    <span className="text-red-600 font-medium">Upload a file</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.zip,.mp4"
                      onChange={(e) => handleFileInputChange(e, 'content')}
                    />
                  </label>
                  <span className="text-gray-600">or drag and drop</span>
                </div>
                
                <p className="text-xs text-gray-500">PDF, ZIP, MP4 up to 1GB</p>
                
                {contentFile && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {contentFile.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}