
import { BadgeCheck, GraduationCap, UserCheck, Laptop, Play, ArrowUpRight} from "lucide-react";
import image_lap from "../assets/aboutUs/image_lap.png";
import studentsImage from "../assets/aboutUs/students.png";
import mask from  "../assets/aboutUs/mask-group.png";
import videoThumb from "../assets/aboutUs/Video Section.png";
import instructorImg from "../assets/aboutUs/instructorImg.png";
import studentImg from "../assets/aboutUs/studentImg.png";
import Navbar from "../components/NavBar";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import BestTalents from "../components/BestTalents";
import TeamLearning from "../components/TeamLearning";

export default function AboutUs({ navigateTo }) {
    return (
        <div className="w-full">
            <Navbar navigateTo={navigateTo} currentPage="about" />
            {/* ========== Hero Section ========== */}
            <section className="relative w-full bg-gradient-to-r from-blue-100 via-white to-pink-100 ">
                <div className="w-full ">
                    <div className="px-6 lg:px-12 py-20">
                    <p className="text-sm text-gray-500 mb-4">Home / About Us</p>

                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
                        Providing Unrivaled <br />
                        Quality in Online Courses
                    </h1>
                    </div>

                    <div className="relative overflow-hidden">
                        <img
                            src={image_lap}
                            alt="Laptop and Coffee"
                            className="shadow-lg w-full object-cover "
                        />

                        {/* Floating Card */}
                        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-2 sm:left-4 md:left-6 bg-white shadow-xl rounded-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex items-center gap-2 sm:gap-3 md:gap-4 max-w-[90%] sm:max-w-sm scale-75 sm:scale-90 md:scale-100 transform origin-bottom-left">
                            <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                                <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0"> 
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">10+</h2>
                                <p className="text-gray-600 font-medium text-sm sm:text-base">Years of Experience</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-3">
                                    Leveraging 10+ years in the field, our online courses offer
                                    expertly developed content, designed to support learners with
                                    engaging and impactful education.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== Why Choose Us Section ========== */}
            <section className="w-full bg-white py-16">
                <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            Why Choose Us for Your Learning Journey
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Our platform is designed to help you grow your skills and achieve
                            success with expertly curated online courses. Learn at your own
                            pace with personalized pathways and interactive resources.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Expert-led courses
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Learn from industry professionals with years of practical
                                        experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <UserCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Personalized learning paths
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Tailored course recommendations designed to match your
                                        career goals.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-pink-100 p-3 rounded-lg">
                                    <Laptop className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Interactive learning
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Engaging exercises and live sessions to reinforce knowledge
                                        effectively.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative lg:col-span-1 flex justify-center p-6">
                        <div className="w-full">
                        <img
                            src={studentsImage}
                            alt="Students Learning Online"
                            className="rounded-lg  w-full object-cover"
                        />
                        </div>
                        <div className="absolute -top-5 sm:-top-8 md:-top-10 -left-5 sm:-left-8 md:-left-10 w-1/2 sm:w-2/4 lg:w-2/4 p-4 sm:p-8 md:p-10">
                            <img
                                src={mask}
                                alt="Students Learning Online"
                                className="rounded-lg  w-full object-cover"
                            />
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* ========== Achievement Section ========== */}
            <section className="w-full bg-white p-10">
                <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Video Thumbnail */}
                    <div className="relative">
                        <img
                            src={videoThumb}
                            alt="Career Impact"
                            className="rounded-xl shadow-lg w-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <button className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-70 rounded-full p-5 hover:bg-opacity-90 transition">
                                <Play className="w-8 h-8 text-black" />
                            </div>
                        </button>

                        {/* Caption */}
                        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-white shadow-lg rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 scale-75 sm:scale-90 md:scale-100 transform origin-bottom-left">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Making Career Impact Together</p>
                            <p className="text-xs sm:text-sm text-gray-600">Founder, MH Master Hub</p>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10">
                            A Journey of Achievement <br /> and Digital Growth
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Stat 1 */}
                            <div className="bg-orange-50 rounded-lg p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-900">15,000+</h3>
                                <p className="text-gray-700 text-sm">Graduate</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="bg-yellow-50 rounded-lg p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-900">1,25,000+</h3>
                                <p className="text-gray-700 text-sm">Active User</p>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-teal-100 rounded-lg p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-900">90%</h3>
                                <p className="text-gray-700 text-sm">Course Complete Rate</p>
                            </div>

                            {/* Stat 4 */}
                            <div className="bg-pink-100 rounded-lg p-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-900">9,000+</h3>
                                <p className="text-gray-700 text-sm">Job Placement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== Instructor & Courses Section ========== */}
            <section className="w-full bg-white py-20">
                <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-8">

                    {/* Card 1 - Instructor */}
                    <div className="bg-purple-50 rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-6 shadow-sm">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Become an Instructor?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Become an Instructor: Join us to share your expertise, inspire learners,
                                and shape the future of education together.
                            </p>
                            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
                                Join with Us
                                <span className="bg-white text-gray-900 rounded-full p-1">
            <ArrowUpRight className="w-4 h-4" />
          </span>
                            </button>
                        </div>
                        <div className="flex-shrink-0">
                            <img src={instructorImg} alt="Instructor" className="w-40 lg:w-48" />
                        </div>
                    </div>

                    {/* Card 2 - Student */}
                    <div className="bg-pink-50 rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-6 shadow-sm">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Get Online Courses
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join as a student to access online courses, gain in-demand skills, and
                                build a strong foundation for future success.
                            </p>
                            <button className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition">
                                Start Learning
                                <span className="bg-white text-green-600 rounded-full p-1">
            <ArrowUpRight className="w-4 h-4" />
          </span>
                            </button>
                        </div>
                        <div className="flex-shrink-0">
                            <img src={studentImg} alt="Student" className="w-40 lg:w-48" />
                        </div>
                    </div>

                </div>
            </section>
            <TeamLearning />
            <BestTalents />
            {/* FAQ Section */}
            <FAQ />
            {/* Footer */}
            <Footer />
        </div>

    );
}