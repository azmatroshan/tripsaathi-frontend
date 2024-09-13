import React from 'react';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center space-x-2">
                        <p>Made with</p>
                        <FaHeart className="text-red-700 animate-pulse" />
                        <p>by Azmat</p>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TripSaathi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
