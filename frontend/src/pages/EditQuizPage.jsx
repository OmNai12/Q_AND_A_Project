// pages/EditQuizPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditQuizPage() {
    const { quizId } = useParams();
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                // Make GET request to fetch quiz details using quizId
                const response = await axios.get(`${import.meta.env.VITE_API_URL_GET_QUIZ_BY_ID}/${quizId}`);
                // Set quiz data from response
                setQuiz(response.data.data);
                setError('');
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setError('Failed to load quiz. Please try again.');

                // If unauthorized, redirect to login
                if (error.response?.status === 401) {
                    navigate('/signin');
                }
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuizData();
        }
    }, [quizId, navigate]);

    const handleBackToQuizzes = () => {
        navigate('/teacher');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-indigo-600">Loading quiz data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Edit Quiz</h1>
                            <p className="mt-1">Quiz ID: {quizId}</p>
                        </div>
                        <button
                            onClick={handleBackToQuizzes}
                            className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        {!quiz || !quiz.quiz || quiz.quiz.length === 0 ? (
                            <div className="p-8 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No quiz generated yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    The quiz generation process may still be in progress or there was an issue generating questions.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                <div className="px-6 py-5 bg-gray-50">
                                    <h2 className="text-xl font-medium text-gray-900">
                                        {quiz.quizName || "Untitled Quiz"}
                                    </h2>
                                </div>

                                <div className="px-6 py-5">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quiz Questions</h3>

                                    <div className="space-y-6">
                                        {quiz.quiz[0].map((question, qIndex) => (
                                            <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                                                        {qIndex + 1}
                                                    </div>
                                                    <div className="ml-3 w-full">
                                                        <p className="text-base font-medium text-gray-900 mb-3">
                                                            {question.question}
                                                        </p>

                                                        <div className="space-y-2 ml-2">
                                                            {Object.entries(question.options).map(([key, value], oIndex) => (
                                                                <div
                                                                    key={key}
                                                                    className={`flex items-center p-2 rounded ${question.correct_option === key ?
                                                                            'bg-green-50 border border-green-100' :
                                                                            'bg-white border border-gray-200'
                                                                        }`}
                                                                >
                                                                    <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                                                                        {key.toUpperCase()}
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <p className={`text-sm ${question.correct_option === key ?
                                                                                'text-green-700 font-medium' :
                                                                                'text-gray-700'
                                                                            }`}>
                                                                            {value}
                                                                            {question.correct_option === key &&
                                                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                                    Correct
                                                                                </span>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditQuizPage;