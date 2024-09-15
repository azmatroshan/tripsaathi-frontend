import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import Snackbar from '../components/Snackbar';

type SignupFormData = {
    name: string;
    email: string;
    password: string;
};

export default function Signup() {
    const navigate = useNavigate();
    const navigation = {
        pages: [],
        user: [
            { name: 'Login', to: '/login' },
        ],
    };

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ message: string; type: string } | null>(null);
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: ''
    });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (snackbar) {
            const timer = setTimeout(() => setSnackbar(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const checkPasswordStrength = (password: string) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkPasswordStrength(formData.password)) {
            setSnackbar({ message: 'Please create a stronger password following the suggestions.', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, 
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data = await response.data;

            if (response.status === 200) {
                console.log(data);
                setSnackbar({ message: 'Registered successfully. Please login to continue.', type: 'success' });
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setSnackbar({ message: data.detail || 'An error occurred while signing up.', type: 'error' });
            }
        } catch (error: any) {
            console.log(error);
            setSnackbar({ message: error.response.data.detail || 'An error occurred while signing up.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleSuggestions = () => {
        setShowSuggestions(!showSuggestions);
    };
    
    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="relative isolate lg:px-8">
                    <div className="mx-auto max-w-md ">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-blue-600 mb-6">
                                <FaUserPlus className="inline-block mr-2" />
                                Sign up
                            </h1>
                        </div>
                        <div className="bg-white border rounded-lg p-6 shadow-lg">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        <FaUser className="inline-block mr-2 text-gray-600" />
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        <FaEnvelope className="inline-block mr-2 text-gray-600" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6 relative">
                                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                        <FaLock className="inline-block mr-2 text-gray-600" />
                                        Password
                                        <button
                                            type="button"
                                            onClick={toggleSuggestions}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            disabled={isLoading}
                                        >
                                            <FaInfoCircle />
                                        </button>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 top-8"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <HiEyeOff className="text-gray-500" />
                                        ) : (
                                            <HiEye className="text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {showSuggestions && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                                        <p className="text-sm text-blue-800 font-medium mb-2">Password Suggestions:</p>
                                        <ul className="list-disc list-inside text-sm text-blue-700">
                                            <li>Use at least 8 characters</li>
                                            <li>Include uppercase and lowercase letters</li>
                                            <li>Include numbers</li>
                                            <li>Include special characters (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                                            <li>Avoid using personal information</li>
                                            <li>Don't use common words or phrases</li>
                                        </ul>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FaUserPlus className="mr-2" />
                                    )}
                                    {isLoading ? 'Signing up...' : 'Sign up'}
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Already a user?{' '}
                                    <Link to="/login" className="text-blue-600 hover:underline">
                                        <FaSignInAlt className="inline-block mr-1" />
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
                </div>
            }
        />
    );
}