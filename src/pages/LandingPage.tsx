import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { FaMapMarkedAlt, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function LandingPage() {
    const navigation = {
        pages: [],
        user: [
            { name: 'Log in', to: '/login' },
            { name: 'Sign up', to: '/signup' },
        ],
    }

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="relative isolate px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-12 sm:py-2 lg:py-32">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-blue-600 mb-6">
                                <FaMapMarkedAlt className="inline-block mr-2" />
                                Effortless Travel Planning, Just for You
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-700">
                                Planning a trip? Let us make it effortless. Share your preferences, and we'll craft a custom itinerary that fits your style and budget. From hidden gems to iconic spots, we've got everything covered. Start your adventure now and travel like never before!
                            </p>
                        </div>
                        <div className="flex gap-4 mt-8 justify-center">
                            <Link to="/signup">
                                <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md tracking-tight hover:bg-blue-700 transition duration-300">
                                    <FaUserPlus className="mr-2" />
                                    Sign Up
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md tracking-tight hover:bg-green-700 transition duration-300">
                                    <FaSignInAlt className="mr-2" />
                                    Log In
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            }
        />
    );
}