// components/HeroSection.jsx
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                            <span className="block">Transform PDFs into</span>
                            <span className="block text-indigo-200">Interactive Quizzes</span>
                        </h1>
                        <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                            NeoQuiz uses AI to automatically generate engaging quizzes from your educational materials. Upload a PDF, and we'll create interactive assessments for your students in seconds.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                            // Github folder Link
                                to="/signup"
                                className="rounded-md shadow px-5 py-3 bg-white text-indigo-600 hover:bg-indigo-50 text-base font-medium"
                            >
                                Get Started
                            </Link>
                            <Link
                            // 
                                to="/features"
                                className="rounded-md px-5 py-3 bg-indigo-800 text-white hover:bg-indigo-700 text-base font-medium"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="relative h-64 lg:h-96 w-full rounded-lg shadow-xl overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-90 rounded-lg">
                                <div className="p-6">
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>

                                    <div className="h-5 bg-indigo-100 rounded w-full mb-3"></div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>

                                    <div className="h-5 bg-indigo-100 rounded w-full mb-3"></div>
                                    <div className="h-24 bg-gray-200 rounded mb-6"></div>

                                    <div className="h-10 bg-indigo-500 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;