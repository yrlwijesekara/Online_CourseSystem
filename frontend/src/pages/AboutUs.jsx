
import { BadgeCheck, GraduationCap, UserCheck, Laptop, Play, ArrowUpRight} from "lucide-react";
import image_lap from "./assets/aboutUs/image_lap.png";
import studentsImage from "./assets/aboutUs/students.png";
import mask from  "./assets/aboutUs/mask-group.png";
import videoThumb from "./assets/aboutUs/Video Section.png";
import instructorImg from "./assets/aboutUs/instructorimg.png";
import studentImg from "./assets/aboutUs/studentImg.png";

export default function AboutUs() {
    return (
        <div className="w-full">
            {/* ========== Hero Section ========== */}
            <section className="relative w-full bg-gradient-to-r from-blue-100 via-white to-pink-100">
                <div className="container mx-auto px-6 py-10 lg:py-20">
                    <p className="text-sm text-gray-500 mb-4">Home / About Us</p>

                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-10">
                        Providing Unrivaled <br />
                        Quality in Online Courses
                    </h1>

                    <div className="relative">
                        <img
                            src={image_lap}
                            alt="Laptop and Coffee"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />

                        {/* Floating Card */}
                        <div className="absolute bottom-6 left-6 bg-white shadow-xl rounded-xl px-6 py-5 flex items-center gap-4 max-w-sm">
                            <div className="bg-green-100 p-3 rounded-full">
                                <BadgeCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">10+</h2>
                                <p className="text-gray-600 font-medium">Years of Experience</p>
                                <p className="text-sm text-gray-500 mt-1">
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
                    <div className="relative lg:col-span-1 flex justify-evenly">
                        <img
                            src={studentsImage}
                            alt="Students Learning Online"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />
                        <img
                            src={mask}
                            alt="Students Learning Online"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ========== Achievement Section ========== */}
            <section className="w-full bg-white py-20">
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
                        <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg px-6 py-4">
                            <p className="font-semibold text-gray-900">Making Career Impact Together</p>
                            <p className="text-sm text-gray-600">Founder, MH Master Hub</p>
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
        </div>

    );
}