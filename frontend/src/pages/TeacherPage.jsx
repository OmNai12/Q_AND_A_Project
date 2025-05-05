import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TeacherPage() {
    const [loading, setLoading] = useState(true);
    const [teacherEmail, setTeacherEmail] = useState('');
    const [quizName, setQuizName] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [quizzes, setQuizzes] = useState([]);

    const navigate = useNavigate();

    // Fetch teacher info and quizzes
    const fetchTeacherData = async () => {
        try {
            const profileResponse = await axios.get(import.meta.env.VITE_API_URL_PROFILE, {
                withCredentials: true
            });

            setTeacherEmail(profileResponse.data.data.email);

            const quizzesResponse = await axios.get(import.meta.env.VITE_API_URL_TEACHER_QUIZZES, {
                withCredentials: true
            });

            setQuizzes(quizzesResponse.data.data.quizzes || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch teacher data:', error);
            navigate('/signin');
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            if (isMounted) {
                await fetchTeacherData();
            }
        };

        initializeData();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            setErrorMessage('Please select a valid PDF file');
            setPdfFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quizName.trim()) {
            setErrorMessage('Please enter a quiz name');
            return;
        }

        if (!pdfFile) {
            setErrorMessage('Please select a PDF file');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('quizName', quizName);
            formData.append('pdfFile', pdfFile);

            const response = await axios.post(
                import.meta.env.VITE_API_URL_CREATE_QUIZ,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            console.log('Quiz created successfully:', response.data);

            setSuccessMessage(response.data.data.displayMessage || 'Quiz created successfully!');
            setQuizName('');
            setPdfFile(null);
            document.getElementById('pdf-upload').value = '';
            fetchTeacherData();
        } catch (error) {
            console.error('Error creating quiz:', error);
            setErrorMessage(
                error.response?.data?.message || 'Failed to create quiz. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleModifyQuiz = (quizId) => {
        // e.preventDefault();
        try {
            navigate(`/edit-quiz/${quizId}`);
        } catch (error) {
            console.log('Error navigating to quiz:', error);
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
                    <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                    {teacherEmail && (
                        <p className="mt-1">Logged in as: {teacherEmail}</p>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Create Quiz Form */}
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 mb-6 bg-white">
                        <h2 className="text-2xl font-semibold mb-6">Create New Quiz</h2>

                        {successMessage && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg" role="alert">
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg" role="alert">
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="quiz-name" className="block text-sm font-medium text-gray-700">
                                    Quiz Name
                                </label>
                                <input
                                    type="text"
                                    id="quiz-name"
                                    name='name'
                                    value={quizName}
                                    onChange={(e) => setQuizName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter a name for your quiz"
                                    required
                                />
                            </div>

                            <div className="mb-4">
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
                                                htmlFor="pdf-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="pdf-upload"
                                                    name="pdf-upload"
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    required
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                        {pdfFile && (
                                            <p className="text-sm text-indigo-600 mt-2">
                                                Selected: {pdfFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {submitting ? 'Creating Quiz...' : 'Create Quiz'}
                            </button>
                        </form>
                    </div>

                    {/* Quizzes List */}
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-semibold mb-6">Your Quizzes</h2>

                        {quizzes.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p>You haven't created any quizzes yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quiz ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quiz Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quizzes.map((quiz) => (
                                            <tr key={quiz.quizId || quiz._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {quiz.quizId || quiz._id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {quiz.quizName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                                        onClick={() => handleModifyQuiz(quiz.quizId || quiz._id)}
                                                    >
                                                        Modify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherPage;
