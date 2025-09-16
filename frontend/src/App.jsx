import './App.css'
import Navbar from './components/NavBar';
import PopularCourses from './components/PopularCourses'
import BestTalents from './components/BestTalents';
import ReviewStudents from './components/ReviewStudents';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage';
import CoursePage from './pages/CoursePage.jsx';


function App() {
  // Change this value to control which page is displayed
  const currentPage = 'home'; // Options: 'home', 'course', 'signin', 'signup'

  return (
    <>
    {currentPage === 'course' && <CoursePage />}
    {currentPage === 'signin' && <SignInPage />}
    {currentPage === 'signup' && <SignUpPage />}
    {currentPage === 'home' && (
      <>
        <Navbar />
        <PopularCourses />
        <BestTalents />
        <ReviewStudents />
      </>
    )}
    </>
  )
} 

export default App;
