import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentPage() {
    const [loading, setLoading] = useState(true);
    const [studentEmail, setStudentEmail] = useState('');
    const [quizId, setQuizId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        // Get student information from the backend
        const fetchStudentInfo = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL_PROFILE, {
                    withCredentials: true // Important for sending cookies
                });

                // Only update state if component is still mounted
                if (isMounted) {
                    // Set the student email from the response
                    setStudentEmail(response.data.data.email);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch student info:', error);
                // Only redirect if component is still mounted
                if (isMounted) {
                    navigate('/signin');
                }
            }
        };

        fetchStudentInfo();

        // Cleanup function to prevent state updates if component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        if (quizId.trim()) {
            // For now, navigate to Instagram as specified
            window.location.href = 'https://www.instagram.com';

            // In the future, this would navigate to the quiz page
            // navigate(`/quiz/${quizId}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-indigo-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner */}
            <div className="bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    {studentEmail && (
                        <p className="mt-1">Logged in as: {studentEmail}</p>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-semibold text-center mb-6">Enter Quiz ID</h2>

                            <form onSubmit={handleQuizSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="quiz-id" className="block text-sm font-medium text-gray-700">
                                        Quiz ID
                                    </label>
                                    <input
                                        type="text"
                                        id="quiz-id"
                                        value={quizId}
                                        onChange={(e) => setQuizId(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter the quiz ID provided by your teacher"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Start Quiz
                                </button>
                            </form>

                            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                                <p className="text-sm text-blue-700">
                                    <strong>Note:</strong> Ask your teacher for the Quiz ID to access your assignments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentPage;