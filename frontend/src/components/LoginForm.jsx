import { useState } from 'react';
import axios from 'axios'; // Import axios for API requests

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [backendError, setBackendError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear validation error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear backend error when user makes changes
    if (backendError) {
      setBackendError('');
    }
  };

  const validateForm = () => {
    const errors = {
      username: formData.username ? '' : 'Username is required',
      password: formData.password ? '' : 'Password is required',
      role: formData.role ? '' : 'Role selection is required'
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setBackendError('');
    
    try {
      // Make API request to your backend
      const response = await axios.post('http://your-backend-url/api/login', formData);
      
      console.log('Login successful:', response.data);
      
      // Handle successful login
      if (response.data.success) {
        // Save user data or token to localStorage or context
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (formData.role === 'student') {
          window.location.href = '/student-dashboard';
        } else {
          window.location.href = '/teacher-dashboard';
        }
      } else {
        // Handle unsuccessful login but with 200 response
        setBackendError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle error response from backend
      console.error('Login error:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setBackendError(err.response.data.message);
      } else {
        setBackendError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 backdrop-blur-lg">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
        <div className="absolute inset-0 -z-10 bg-white/40 rounded-lg backdrop-blur-xl"></div>
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {backendError && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-400">
            {backendError}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your username"
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="student"
                    name="role"
                    type="radio"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="student" className="ml-3 block text-sm font-medium text-gray-700">
                    Student
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="teacher"
                    name="role"
                    type="radio"
                    value="teacher"
                    checked={formData.role === 'teacher'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="teacher" className="ml-3 block text-sm font-medium text-gray-700">
                    Teacher
                  </label>
                </div>
              </div>
              {validationErrors.role && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          

        </form>
      </div>
    </div>
  );
};

export default LoginForm;