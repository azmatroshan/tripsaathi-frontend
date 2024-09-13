import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Layout from '../components/Layout';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

type LoginFormData = {
    email: string;
    password: string;
};

export default function Login() {
    const navigate = useNavigate();
    const navigation = {
        pages: [],
        user: [
            { name: 'Sign up', to: '/signup' },
        ],
    }

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, 
            {
                email: formData.email,
                password: formData.password
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (response.status === 200) {
                const data = response.data; 
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_id', data.id);
                window.alert('Logged in successfully.');
                navigate('/'); 
            } else {
                window.alert('Login failed.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                window.alert(error.response.data.message || 'An error occurred while logging in.');
            } else {
                window.alert('An error occurred. Please try again later.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="relative isolate lg:px-8">
                    <div className="mx-auto max-w-md">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-blue-600 mb-6">
                                <FaSignInAlt className="inline-block mr-2" />
                                Welcome Back
                            </h1>
                        </div>
                        <div className="bg-white border rounded-lg p-6 shadow-lg">
                            <form onSubmit={handleSubmit}>
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
                                    />
                                </div>
                                <div className="mb-6 relative">
                                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                        <FaLock className="inline-block mr-2 text-gray-600" />
                                        Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 top-8"
                                    >
                                        {showPassword ? (
                                            <HiEyeOff className="text-gray-500" />
                                        ) : (
                                            <HiEye className="text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md tracking-tight hover:bg-blue-700 transition duration-300"
                                >
                                    <FaSignInAlt className="inline-block mr-2" />
                                    Log In
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Not a user?{' '}
                                    <Link to="/signup" className="text-blue-500 hover:underline">
                                        <FaUserPlus className="inline-block mr-1" />
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}