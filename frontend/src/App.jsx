import './App.css'
import Navbar from './components/NavBar';
import PopularCourses from './components/PopularCourses'
import BestTalents from './components/BestTalents';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage';
import CoursePage from './pages/CoursePage';


function App() {
  // Change this value to control which page is displayed
  const currentPage = 'course'; // Options: 'home', 'course', 'signin', 'signup'

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
      </>
    )}
    </>
  )
} 

export default App;
