import { ArrowUpRight } from "lucide-react";

import experienceImg from "../assets/aboutUs/image_lap.png"; // Using an existing image as fallback


export default function TeamLearning() {
    return (
        <section className="w-full bg-white py-20">
            <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">

                {/* Left: Image with floating card */}
                <div className="relative">
                    <img
                        src={experienceImg}
                        alt="Learning Experience"
                        className="rounded-2xl shadow-lg w-full object-cover"
                    />


                    <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-2 sm:left-4 md:left-6 bg-white shadow-xl rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 scale-75 sm:scale-90 md:scale-100 transform origin-bottom-left">
                        <p className="text-xs sm:text-sm text-gray-600">Average Class Completion Rate</p>
                        <p className="text-green-600 text-xs mt-1">↑ 65+</p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">95%</h3>

                    </div>
                </div>

                {/* Right: Content */}
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        We Ensure an Exceptional <br /> Learning Experience
                    </h2>
                    <p className="text-gray-600 mb-10">
                        We guarantee an exceptional learning experience with expert instructors,
                        interactive lessons, and hands-on opportunities designed to ensure student
                        success and growth.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">100,000+</h3>
                            <p className="text-gray-600 text-sm">
                                Students effectively enhanced digital skills using our platform.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">20,000+</h3>
                            <p className="text-gray-600 text-sm">
                                Students have built successful careers in various tech companies.
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition">
                        Explore Courses
                        <span className="bg-white text-green-600 rounded-full p-1">
              <ArrowUpRight className="w-4 h-4" />
            </span>
                    </button>
                </div>
            </div>
        </section>
    );
}