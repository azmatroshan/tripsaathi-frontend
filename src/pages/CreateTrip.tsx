import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import { FaPlane, FaWallet, FaCalendarAlt, FaClock, FaList } from 'react-icons/fa';
import { useNavigate } from "react-router";
import Snackbar from "../components/Snackbar";
import InputField from "../components/InputField";



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
    const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTripData({
            ...tripData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (snackbar) {
            const timer = setTimeout(() => setSnackbar(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar]);

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
                setSnackbar({ message: "Trip created successfully!", type: 'success' });
                setTripData({
                    user_id: localStorage.getItem('user_id') || "",
                    destination: "",
                    budget: "",
                    start_date: "",
                    duration: "",
                    interests: ""
                });
                const trip = response.data;
                setTimeout(() => navigate(`/trip/${trip.id}`, { state: { trip } } ), 1000);
            }
        } catch (error: any) {
            console.error(error.response.data.detail);
            setSnackbar({ message: error.response.data.detail || "Error creating trip. Please try again.", type: 'error' });
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
                            disabled={loading}
                        />
                        
                        <InputField 
                            icon={<FaWallet className="inline-block mr-2" />}
                            label="Budget (₹)"
                            name="budget"
                            type="number"
                            value={tripData.budget}
                            placeholder="e.g., 10000"
                            onChange={handleInputChange}
                            disabled={loading}
                        />

                        <InputField 
                            icon={<FaCalendarAlt className="inline-block mr-2" />}
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={tripData.start_date}
                            onChange={handleInputChange}
                            disabled={loading}
                        />

                        <InputField 
                            icon={<FaClock className="inline-block mr-2" />}
                            label="Duration (days)"
                            name="duration"
                            type="number"
                            value={tripData.duration}
                            placeholder="e.g., 5"
                            onChange={handleInputChange}
                            disabled={loading}
                        />

                        <InputField 
                            icon={<FaList className="inline-block mr-2" />}
                            label="Interests"
                            name="interests"
                            type="text"
                            value={tripData.interests}
                            placeholder="e.g., art, culture, history, Club"
                            onChange={handleInputChange}
                            disabled={loading}
                        />

                        <div className="mt-8">
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Trip"
                                )}
                            </button>
                        </div>
                    </form>

                    {snackbar && (
                        <Snackbar message={snackbar.message} type={snackbar.type} />
                    )}
                </div>
            }
        />
    );
}
