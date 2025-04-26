// pages/TeacherPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TeacherPage() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication and get teacher details
        const verifyAuth = async () => {
            try {
                const response = await axios.get('/api/auth/verify', {
                    withCredentials: true
                });

                // Verify that user is a teacher
                if (response.data.role !== 'teacher') {
                    navigate('/signin');
                    return;
                }

                setTeacher(response.data);
                setLoading(false);
            } catch (error) {
                // If not authenticated, redirect to sign in
                navigate('/signin');
            }
        };

        verifyAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
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
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-bold mb-4">Hi, Teacher {teacher?.name || teacher?.email}!</h2>
                        <p className="mb-4">Welcome to your NeoQuiz teacher dashboard. Here you can:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Upload PDF documents to generate quizzes</li>
                            <li>Manage your quizzes and assignments</li>
                            <li>Track student performance and results</li>
                            <li>Configure quiz settings and parameters</li>
                        </ul>

                        <div className="mt-8 bg-indigo-50 p-4 rounded-md">
                            <h3 className="text-lg font-medium text-indigo-800 mb-2">Upload a PDF to create a quiz</h3>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">PDF Document</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Generate Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TeacherPage;