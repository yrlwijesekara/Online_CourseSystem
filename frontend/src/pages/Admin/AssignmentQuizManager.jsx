import { useState, useEffect } from 'react';

const AssignmentQuizManager = ({ lessonId, onClose }) => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null); // ID of assignment being edited
  const [editingQuiz, setEditingQuiz] = useState(null); // ID of quiz being edited
  const [isEditing, setIsEditing] = useState(false); // Flag to indicate edit mode
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, type: null, id: null }); // For delete confirmation

  // Form states for creating/editing assignments
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    contents: ''
  });

  // Form states for creating/editing quizzes
  const [quizForm, setQuizForm] = useState({
    title: '',
    questions: [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
  });
  
  // Original forms for cancel functionality
  const [originalAssignmentForm, setOriginalAssignmentForm] = useState(null);
  const [originalQuizForm, setOriginalQuizForm] = useState(null);

  useEffect(() => {
    fetchData();
    loadUserData();
  }, [lessonId]);
  
  const loadUserData = () => {
    try {
      // First check user JSON from localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        console.log('Current user from localStorage:', user);
        
        // Also try to get role from JWT token as a backup/verification
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('JWT token payload:', payload);
              
              if (payload.role && (!user.role || user.role !== payload.role)) {
                console.warn('Role in token differs from role in user object!');
                // Update user object with role from token
                const updatedUser = {...user, role: payload.role};
                setCurrentUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('Updated user role from token:', updatedUser.role);
              }
            }
          } catch (err) {
            console.error('Error decoding JWT token:', err);
          }
        }
        
        // Validate if user has proper permissions
        const role = user.role;
        if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
          setError(`Warning: You need instructor or admin privileges to create assignments and quizzes. Your current role is: ${role || 'undefined'}`);
        }
      } else {
        setError('User information not found. Please log in again.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error loading user profile. Please log in again.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in again.');
      }
      
      // Fetch assignments
      console.log(`Fetching assignments for lesson ${lessonId}...`);
      const assignmentsResponse = await fetch(`http://localhost:3001/api/assignment/lesson/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!assignmentsResponse.ok) {
        const statusText = assignmentsResponse.statusText;
        let errorMessage = `Failed to fetch assignments (${assignmentsResponse.status} ${statusText})`;
        
        try {
          const errorData = await assignmentsResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (err) {
          // Unable to parse error response
        }
        
        throw new Error(errorMessage);
      }
      
      const assignmentsData = await assignmentsResponse.json();
      console.log(`Successfully fetched ${assignmentsData.length} assignments`);
      setAssignments(assignmentsData);
      
      // Fetch quizzes
      console.log(`Fetching quizzes for lesson ${lessonId}...`);
      const quizzesResponse = await fetch(`http://localhost:3001/api/quiz?lessonId=${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!quizzesResponse.ok) {
        const statusText = quizzesResponse.statusText;
        let errorMessage = `Failed to fetch quizzes (${quizzesResponse.status} ${statusText})`;
        
        try {
          const errorData = await quizzesResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (err) {
          // Unable to parse error response
        }
        
        throw new Error(errorMessage);
      }
      
      const quizzesData = await quizzesResponse.json();
      // Filter quizzes for this lesson
      const lessonQuizzes = quizzesData.filter(quiz => quiz.lessonId === Number(lessonId));
      console.log(`Successfully fetched ${lessonQuizzes.length} quizzes for this lesson`);
      setQuizzes(lessonQuizzes);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Data loading error: ${error.message}`);
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
  
  // Edit mode handlers for Assignments
  const handleEditAssignment = (assignment) => {
    // Save original form data for cancellation
    setOriginalAssignmentForm({...assignmentForm});
    
    // Format dueDate for the form (YYYY-MM-DD)
    let formattedDueDate = '';
    if (assignment.dueDate) {
      const date = new Date(assignment.dueDate);
      formattedDueDate = date.toISOString().split('T')[0];
    }
    
    // Format contents
    let formattedContents = '';
    if (assignment.contents) {
      // If contents is an object, stringify it
      if (typeof assignment.contents === 'object') {
        formattedContents = JSON.stringify(assignment.contents);
      } else {
        formattedContents = assignment.contents;
      }
    }
    
    // Set form data with the assignment to be edited
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: formattedDueDate,
      contents: formattedContents
    });
    
    // Set editing state
    setEditingAssignment(assignment.id);
    setIsEditing(true);
  };
  
  const handleCancelEditAssignment = () => {
    // Restore original form data
    if (originalAssignmentForm) {
      setAssignmentForm(originalAssignmentForm);
    } else {
      // Reset to empty form
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        contents: ''
      });
    }
    
    // Clear editing state
    setEditingAssignment(null);
    setIsEditing(false);
  };
  
  // Edit mode handlers for Quizzes
  const handleEditQuiz = (quiz) => {
    // Save original form data for cancellation
    setOriginalQuizForm({...quizForm});
    
    // Format questions for the form
    const formattedQuestions = quiz.questions.map(q => {
      let options = '';
      let correct = '';
      
      try {
        // Parse options if they exist and are stored as JSON string
        if (q.options) {
          const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
          options = Array.isArray(parsedOptions) ? parsedOptions.join(', ') : '';
        }
        
        // Parse correct answer if stored as JSON string
        if (q.correct) {
          const parsedCorrect = typeof q.correct === 'string' ? JSON.parse(q.correct) : q.correct;
          correct = Array.isArray(parsedCorrect) ? parsedCorrect.join(', ') : parsedCorrect.toString();
        }
      } catch (error) {
        console.error('Error parsing question data:', error);
        options = q.options || '';
        correct = q.correct || '';
      }
      
      return {
        id: q.id, // Keep track of existing question IDs for updating
        text: q.text,
        type: q.type || 'MCQ',
        options: options,
        correct: correct,
        marks: q.marks || 1
      };
    });
    
    // Set form data with the quiz to be edited
    setQuizForm({
      title: quiz.title,
      questions: formattedQuestions.length > 0 ? formattedQuestions : [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
    });
    
    // Set editing state
    setEditingQuiz(quiz.id);
    setIsEditing(true);
  };
  
  const handleCancelEditQuiz = () => {
    // Restore original form data
    if (originalQuizForm) {
      setQuizForm(originalQuizForm);
    } else {
      // Reset to empty form
      setQuizForm({
        title: '',
        questions: [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
      });
    }
    
    // Clear editing state
    setEditingQuiz(null);
    setIsEditing(false);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        throw new Error('Authentication token missing. Please log in again.');
      }
      
      // Log token details (safely - just showing first few chars)
      console.log('Token found:', token.substring(0, 15) + '...');
      
      // Try to decode token to check contents (client-side only for debugging)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', {
            userId: payload.userId,
            role: payload.role,
            exp: new Date(payload.exp * 1000).toLocaleString()
          });
        }
      } catch (err) {
        console.error('Error decoding token (this is just for debugging):', err);
      }
      
      // Check user role with detailed debugging
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('User JSON not found in localStorage');
        throw new Error('User information missing. Please log in again.');
      }
      
      let user;
      try {
        user = JSON.parse(userJson);
        console.log('Current user data for assignment creation:', {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        if (!user.role) {
          console.error('User role is undefined or null');
          throw new Error('User role information is missing. Please log in again.');
        }
        
        if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
          console.error(`User role "${user.role}" is not INSTRUCTOR or ADMIN`);
          throw new Error(`You don't have permission to create assignments. Your role is: ${user.role}`);
        }
      } catch (err) {
        console.error('Error parsing user JSON:', err);
        throw new Error('Invalid user data. Please log in again.');
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
      
      const response = await fetch('http://localhost:3001/api/assignment', {
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
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSubmitting(true);
    try {
      if (!editingAssignment) {
        throw new Error('No assignment selected for editing');
      }
      
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
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can update assignments');
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
      
      console.log('Updating assignment with data:', {
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate || null,
        contents: formattedContents
      });
      
      const response = await fetch(`http://localhost:3001/api/assignment/${editingAssignment}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: assignmentForm.title,
          description: assignmentForm.description,
          dueDate: assignmentForm.dueDate || null,
          contents: formattedContents
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
        
        console.error(`Assignment update failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to update assignments. Only instructors and admins can perform this action.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid assignment data. Please check your inputs.');
        } else {
          throw new Error(errorData.error || `Failed to update assignment (${response.status}). Please try again.`);
        }
      }
      
      // Reset form and editing state
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        contents: ''
      });
      setEditingAssignment(null);
      setIsEditing(false);
      
      // Refresh assignments
      fetchData();
      
    } catch (error) {
      console.error('Error updating assignment:', error);
      setError(error.message || 'Failed to update assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSubmitting(true);
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
      
      const response = await fetch('http://localhost:3001/api/quiz', {
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
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleShowDeleteConfirmation = (type, id) => {
    setDeleteConfirmation({
      show: true,
      type,
      id
    });
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      type: null,
      id: null
    });
  };
  
  const handleDeleteAssignment = async (id) => {
    setError(null);
    setSubmitting(true);
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
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can delete assignments');
      }
      
      const response = await fetch(`http://localhost:3001/api/assignment/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        
        console.error(`Assignment deletion failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to delete assignments. Only instructors and admins can perform this action.');
        } else {
          throw new Error(errorData.error || `Failed to delete assignment (${response.status}). Please try again.`);
        }
      }
      
      // Clear deletion confirmation state
      handleCancelDelete();
      
      // Refresh assignments
      fetchData();
      
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError(error.message || 'Failed to delete assignment.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSubmitting(true);
    try {
      if (!editingQuiz) {
        throw new Error('No quiz selected for editing');
      }
      
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
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can update quizzes');
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
        id: q.id || undefined, // Include ID if it exists (for existing questions)
        text: q.text,
        type: q.type,
        options: q.type === 'MCQ' || q.type === 'MULTISELECT' ? q.options.split(',').map(opt => opt.trim()) : null,
        correct: q.correct,
        marks: Number(q.marks)
      }));
      
      console.log('Updating quiz with data:', {
        title: quizForm.title,
        questions: formattedQuestions
      });
      
      const response = await fetch(`http://localhost:3001/api/quiz/${editingQuiz}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quizForm.title,
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
        
        console.error(`Quiz update failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to update quizzes. Only instructors and admins can perform this action.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid quiz data. Please check your inputs.');
        } else {
          throw new Error(errorData.error || `Failed to update quiz (${response.status}). Please try again.`);
        }
      }
      
      // Reset form and editing state
      setQuizForm({
        title: '',
        questions: [{ text: '', type: 'MCQ', options: '', correct: '', marks: 1 }]
      });
      setEditingQuiz(null);
      setIsEditing(false);
      
      // Refresh quizzes
      fetchData();
      
    } catch (error) {
      console.error('Error updating quiz:', error);
      setError(error.message || 'Failed to update quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    setError(null);
    setSubmitting(true);
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
      if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        throw new Error('Only instructors and admins can delete quizzes');
      }
      
      const response = await fetch(`http://localhost:3001/api/quiz/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        
        console.error(`Quiz deletion failed (${response.status} ${statusText}):`, errorData);
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to delete quizzes. Only instructors and admins can perform this action.');
        } else {
          throw new Error(errorData.error || `Failed to delete quiz (${response.status}). Please try again.`);
        }
      }
      
      // Clear deletion confirmation state
      handleCancelDelete();
      
      // Refresh quizzes
      fetchData();
      
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setError(error.message || 'Failed to delete quiz.');
    } finally {
      setSubmitting(false);
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
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === 'assignment') {
                    handleDeleteAssignment(deleteConfirmation.id);
                  } else if (deleteConfirmation.type === 'quiz') {
                    handleDeleteQuiz(deleteConfirmation.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">Manage Assignments & Quizzes</h2>
          {currentUser && (
            <p className="text-sm text-gray-500">
              Logged in as: {currentUser.name} 
              <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentUser.role}
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const userJson = localStorage.getItem('user');
              const user = userJson ? JSON.parse(userJson) : null;
              const token = localStorage.getItem('token');
              let tokenRole = "Not found";
              
              if (token) {
                try {
                  const tokenParts = token.split('.');
                  if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    tokenRole = payload.role || "Not specified in token";
                  }
                } catch (err) {
                  tokenRole = "Error decoding token";
                }
              }
              
              alert(`Current User Role from localStorage: ${user?.role || 'Not found'}
Role from JWT Token: ${tokenRole}
User ID: ${user?.id || 'Not found'}
User Email: ${user?.email || 'Not found'}

If your role is not INSTRUCTOR or ADMIN, you cannot create assignments.`);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded border"
            type="button"
          >
            Debug Role
          </button>
          <button
            onClick={() => {
              try {
                // Get token and extract role
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('No token found. Please log in again.');
                  return;
                }
                
                // Decode token
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                  alert('Invalid token format. Please log in again.');
                  return;
                }
                
                const payload = JSON.parse(atob(tokenParts[1]));
                if (!payload.role) {
                  alert('No role found in token. Please log in again.');
                  return;
                }
                
                // Update user in localStorage with role from token
                const userJson = localStorage.getItem('user');
                if (!userJson) {
                  alert('No user data found. Please log in again.');
                  return;
                }
                
                const user = JSON.parse(userJson);
                user.role = payload.role; // Use role from token
                localStorage.setItem('user', JSON.stringify(user));
                
                // Update current user state
                setCurrentUser({...user});
                
                alert(`Updated user role from token: ${payload.role}`);
                
                // Reload the page to refresh all data
                window.location.reload();
              } catch (err) {
                alert(`Error updating role: ${err.message}`);
              }
            }}
            className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded border border-blue-300"
            type="button"
          >
            Fix Role
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
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
              <form onSubmit={editingAssignment ? handleUpdateAssignment : handleAssignmentSubmit} className="space-y-4">
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
                <div className="flex justify-between">
                  {editingAssignment ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEditAssignment}
                        className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center justify-center ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded transition-colors`}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Updating...
                          </>
                        ) : 'Update Assignment'}
                      </button>
                    </>
                  ) : (
                    <button 
                      type="submit"
                      disabled={submitting}
                      className={`flex items-center justify-center ${submitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded transition-colors`}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </>
                      ) : 'Create Assignment'}
                    </button>
                  )}
                </div>
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
                          <button 
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleShowDeleteConfirmation('assignment', assignment.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
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
              <form onSubmit={editingQuiz ? handleUpdateQuiz : handleQuizSubmit} className="space-y-4">
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
                
                <div className="flex justify-between">
                  {editingQuiz ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEditQuiz}
                        className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center justify-center ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded transition-colors`}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Updating...
                          </>
                        ) : 'Update Quiz'}
                      </button>
                    </>
                  ) : (
                    <button 
                      type="submit"
                      disabled={submitting}
                      className={`flex items-center justify-center ${submitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded transition-colors ml-auto`}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </>
                      ) : 'Create Quiz'}
                    </button>
                  )}
                </div>
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
                          <button 
                            onClick={() => handleEditQuiz(quiz)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleShowDeleteConfirmation('quiz', quiz.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
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