import React, { useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import { FaPlane, FaWallet, FaCalendarAlt, FaClock, FaList } from 'react-icons/fa';
import { useNavigate } from "react-router";


const InputField = ({ icon, label, name, type, value, placeholder, required = true, onChange }: any) => (
    <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={name}>
            {icon} {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-300 transition duration-150 ease-in-out"
            required={required}
        />
    </div>
);

export default function CreateTrip() {
    const navigate = useNavigate();
    const navigation = {
        pages: [
            { name: 'Create a Trip', to: '/create-trip', selected: true },
            { name: 'Favorite Trips', to: '/favorite-trips', selected: false },
        ],
        user: [
            { name: 'Log out', to: '/' },
        ],
    };

    const [tripData, setTripData] = useState({
        user_id: localStorage.getItem('user_id') || "",
        destination: "",
        budget: "",
        start_date: "",
        duration: "",
        interests: ""
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTripData({
            ...tripData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formattedDestination = tripData.destination.split(",").map(dest => dest.trim());
    
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/trips/create`, 
                {
                    ...tripData,
                    destination: formattedDestination,
                    budget: parseInt(tripData.budget),
                    duration: parseInt(tripData.duration),
                    interests: tripData.interests.split(",").map(interest => interest.trim()),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 201) {
                setSuccessMessage("Trip created successfully!");
                setTripData({
                    user_id: localStorage.getItem('user_id') || "",
                    destination: "",
                    budget: "",
                    start_date: "",
                    duration: "",
                    interests: ""
                });
                navigate('/');
            }
        } catch (error) {
            console.error("Error creating trip:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="max-w-2xl mx-auto bg-white border rounded-lg p-6 shadow-lg transition-shadow relative">
                    <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Create a New Trip</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField 
                            icon={<FaPlane className="inline-block mr-2" />}
                            label="Destination"
                            name="destination"
                            type="text"
                            value={tripData.destination}
                            placeholder="e.g., Delhi, Noida"
                            onChange={handleInputChange}
                        />
                        
                        <InputField 
                            icon={<FaWallet className="inline-block mr-2" />}
                            label="Budget (₹)"
                            name="budget"
                            type="number"
                            value={tripData.budget}
                            placeholder="e.g., 10000"
                            onChange={handleInputChange}
                        />

                        <InputField 
                            icon={<FaCalendarAlt className="inline-block mr-2" />}
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={tripData.start_date}
                            onChange={handleInputChange}
                        />

                        <InputField 
                            icon={<FaClock className="inline-block mr-2" />}
                            label="Duration (days)"
                            name="duration"
                            type="number"
                            value={tripData.duration}
                            placeholder="e.g., 5"
                            onChange={handleInputChange}
                        />

                        <InputField 
                            icon={<FaList className="inline-block mr-2" />}
                            label="interests"
                            name="interests"
                            type="text"
                            value={tripData.interests}
                            placeholder="e.g., art, culture, history, Club"
                            onChange={handleInputChange}
                        />

                        <div className="mt-8">
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Trip"}
                            </button>
                        </div>
                    </form>

                    {successMessage && (
                        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            <p className="font-semibold">{successMessage}</p>
                        </div>
                    )}
                </div>
            }
        />
    );
}
