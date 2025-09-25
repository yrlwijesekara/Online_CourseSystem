import { useState, useEffect } from 'react';

const AssignmentQuizManager = ({ lessonId, onClose }) => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for creating assignments
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    contents: ''
  });

  // Form states for creating quizzes
  const [quizForm, setQuizForm] = useState({
    title: '',
    questions: [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
  });

  useEffect(() => {
    fetchData();
  }, [lessonId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch assignments
      const assignmentsResponse = await fetch(`http://localhost:3001/api/assignments/lesson/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!assignmentsResponse.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      const assignmentsData = await assignmentsResponse.json();
      setAssignments(assignmentsData);
      
      // Fetch quizzes
      // Note: This would require an endpoint to get quizzes by lessonId
      const quizzesResponse = await fetch(`http://localhost:3001/api/quizzes?lessonId=${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!quizzesResponse.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      
      const quizzesData = await quizzesResponse.json();
      // Filter quizzes for this lesson
      const lessonQuizzes = quizzesData.filter(quiz => quiz.lessonId === Number(lessonId));
      setQuizzes(lessonQuizzes);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizForm.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', type: 'MCQ', options: '', correct: '', marks: 1 }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (quizForm.questions.length > 1) {
      const updatedQuestions = [...quizForm.questions];
      updatedQuestions.splice(index, 1);
      
      setQuizForm(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in again.');
      }
      
      // Check user role
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User information missing. Please log in again.');
      }
      
      const user = JSON.parse(userJson);
      console.log('Current user role for assignment creation:', user.role);
      
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can create assignments');
      }
      
      // Format the contents if it's provided
      let formattedContents = null;
      if (assignmentForm.contents) {
        try {
          // Check if it's valid JSON, otherwise treat as string
          const parsed = JSON.parse(assignmentForm.contents);
          formattedContents = parsed;
        } catch (err) {
          // If not valid JSON, use as string
          formattedContents = assignmentForm.contents;
        }
      }

      console.log('Submitting assignment with data:', {
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate || null,
        contents: formattedContents,
        lessonId: parseInt(lessonId)
      });
      
      const response = await fetch('http://localhost:3001/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: assignmentForm.title,
          description: assignmentForm.description,
          dueDate: assignmentForm.dueDate || null,
          contents: formattedContents,
          lessonId: parseInt(lessonId)
        })
      });
      
      if (!response.ok) {
        // Get response status text
        const statusText = response.statusText;
        
        // Try to parse error response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = { error: 'Unknown error' };
        }
        
        console.error(`Assignment creation failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to create assignments. Only instructors and admins can perform this action.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid assignment data. Please check your inputs.');
        } else {
          throw new Error(errorData.error || `Failed to create assignment (${response.status}). Please try again.`);
        }
      }
      
      // Reset form and refresh assignments
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        contents: ''
      });
      
      fetchData();
      
    } catch (error) {
      console.error('Error creating assignment:', error);
      // Display a more detailed error message
      setError(error.message || 'Failed to create assignment. Check if you have instructor permissions.');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in again.');
      }
      
      // Check user role
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User information missing. Please log in again.');
      }
      
      const user = JSON.parse(userJson);
      console.log('Current user role for quiz creation:', user.role);
      
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can create quizzes');
      }
      
      // Validate questions before submission
      if (!quizForm.title.trim()) {
        throw new Error('Quiz title is required');
      }
      
      for (let i = 0; i < quizForm.questions.length; i++) {
        const q = quizForm.questions[i];
        if (!q.text.trim()) {
          throw new Error(`Question ${i+1} text is required`);
        }
        
        if ((q.type === 'MCQ' || q.type === 'MULTISELECT') && !q.options.trim()) {
          throw new Error(`Options are required for question ${i+1}`);
        }
        
        if (!q.correct.trim()) {
          throw new Error(`Correct answer is required for question ${i+1}`);
        }
      }
      
      // Format questions properly
      const formattedQuestions = quizForm.questions.map(q => ({
        text: q.text,
        type: q.type,
        options: q.type === 'MCQ' || q.type === 'MULTISELECT' ? q.options.split(',').map(opt => opt.trim()) : null,
        correct: q.correct,
        marks: Number(q.marks)
      }));
      
      console.log('Submitting quiz with data:', {
        title: quizForm.title,
        lessonId: parseInt(lessonId),
        questions: formattedQuestions
      });
      
      const response = await fetch('http://localhost:3001/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quizForm.title,
          lessonId: parseInt(lessonId),
          questions: formattedQuestions
        })
      });
      
      if (!response.ok) {
        // Get response status text
        const statusText = response.statusText;
        
        // Try to parse error response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = { error: 'Unknown error' };
        }
        
        console.error(`Quiz creation failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to create quizzes. Only instructors and admins can perform this action.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid quiz data. Please check your inputs.');
        } else {
          throw new Error(errorData.error || `Failed to create quiz (${response.status}). Please try again.`);
        }
      }
      
      // Reset form and refresh quizzes
      setQuizForm({
        title: '',
        questions: [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
      });
      
      fetchData();
      
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.message || 'Failed to create quiz. Check if you have instructor permissions.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto max-h-screen flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Manage Assignments & Quizzes</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'assignments' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-600'}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'quizzes' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-600'}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto flex-1">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Assignments Tab Content */}
        {activeTab === 'assignments' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Assignment</h3>
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={assignmentForm.title}
                    onChange={handleAssignmentChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={assignmentForm.description}
                    onChange={handleAssignmentChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
                  <input 
                    type="date" 
                    name="dueDate"
                    value={assignmentForm.dueDate}
                    onChange={handleAssignmentChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Content (optional)</label>
                  <textarea
                    name="contents"
                    value={assignmentForm.contents}
                    onChange={handleAssignmentChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                    placeholder="Additional instructions or content in JSON format"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                  Create Assignment
                </button>
              </form>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Current Assignments</h3>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                          {assignment.dueDate && (
                            <p className="text-sm text-gray-500 mt-2">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:underline text-sm">Edit</button>
                          <button className="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No assignments created yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Quizzes Tab Content */}
        {activeTab === 'quizzes' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Quiz</h3>
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={quizForm.title}
                    onChange={handleQuizChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div className="space-y-6">
                  <h4 className="font-medium">Questions</h4>
                  
                  {quizForm.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Question {index + 1}</h5>
                        <button 
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={quizForm.questions.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <input 
                          type="text" 
                          value={question.text}
                          onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <select 
                          value={question.type}
                          onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="MCQ">Multiple Choice</option>
                          <option value="MULTISELECT">Multi-select</option>
                          <option value="TEXT">Text Answer</option>
                        </select>
                      </div>
                      
                      {(question.type === 'MCQ' || question.type === 'MULTISELECT') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
                          <input 
                            type="text" 
                            value={question.options}
                            onChange={(e) => handleQuestionChange(index, 'options', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                            placeholder="Option 1, Option 2, Option 3"
                            required
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Answer
                          {question.type === 'MULTISELECT' && ' (comma separated)'}
                        </label>
                        <input 
                          type="text" 
                          value={question.correct}
                          onChange={(e) => handleQuestionChange(index, 'correct', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                        <input 
                          type="number" 
                          value={question.marks}
                          onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Question
                  </button>
                </div>
                
                <button 
                  type="submit"
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                  Create Quiz
                </button>
              </form>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Current Quizzes</h3>
              {quizzes.length > 0 ? (
                <div className="space-y-4">
                  {quizzes.map(quiz => (
                    <div key={quiz.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{quiz.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {quiz.questions?.length || 0} questions • {quiz.totalMarks} marks
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:underline text-sm">Edit</button>
                          <button className="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No quizzes created yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentQuizManager;