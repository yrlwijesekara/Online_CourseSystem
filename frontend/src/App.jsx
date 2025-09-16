import './App.css'
import Navbar from './components/NavBar';
import PopularCourses from './components/PopularCourses'
import BestTalents from './components/BestTalents';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage';


function App() {


  return (
    <>
    
    {/* <SignInPage/> */}
    {/* <SignUpPage/> */}
    <Navbar/>
      <PopularCourses/>
      <BestTalents/>
    </>
  )
} 

export default App;
