import './App.css'
// import { useState } from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage';
import CoursePage from './pages/CoursePage';
import AdminInstructors from './pages/AdminInstructors';


function App() {
  // // Use state to manage which page is displayed
  // const [currentPage, setCurrentPage] = useState('home'); // Options: 'home', 'course', 'signin', 'signup'
  
  // // Function to navigate between pages
  // const navigateTo = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    <>
    {/* {currentPage === 'course' && <CoursePage navigateTo={navigateTo} />}
    {currentPage === 'signin' && <SignInPage navigateTo={navigateTo} />}
    {currentPage === 'signup' && <SignUpPage navigateTo={navigateTo} />}
    {currentPage === 'home' && <HomePage navigateTo={navigateTo} />} */}
    <AdminInstructors/>
    </>
  )
} 

export default App;
