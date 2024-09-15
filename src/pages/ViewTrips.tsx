import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import { FaMapMarkerAlt, FaCalendarAlt, FaWallet, FaList, FaClock, FaArrowLeft, FaHeart } from 'react-icons/fa';

interface Trip {
    id: number;
    destination: string[];
    start_date: string;
    budget: number;
    interests: string[];
    duration: number;
    itineraries: {
        destination: string;
        budget: number;
        duration: number;
        itinerary: {
            day: number;
            activities: {
                name: string;
                cost: number;
                description: string;
            }[];
        }[];
    }[];
    favorite: boolean;
}

export default function ViewTrips() {
    const navigation = {
        pages: [
            { name: 'Create a Trip', to: '/create-trip', selected: false },
            { name: 'Favorite Trips', to: '/favorite-trips', selected: false },
        ],
        user: [
            { name: 'Log out', to: '/' },
        ],
    }

    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingFavorite, setUpdatingFavorite] = useState<number | null>(null);

    useEffect(() => {
        const handleViewTrips = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                if (userId) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/trips/view?user_id=${userId}`);
                    if (response.status === 200) {
                        setTrips(response.data);
                    } else {
                        console.error('An error occurred while fetching trips.');
                    }
                } else {
                    console.error('User ID not found.');
                }
            } catch (error) {
                console.error('An error occurred while fetching trips.', error);
            } finally {
                setIsLoading(false);
            }
        };

        handleViewTrips();
    }, []);

    const handleCardClick = (trip: Trip) => {
        setSelectedTrip(trip);
    };

    const handleFavoriteClick = async (e: React.MouseEvent, tripId: number, isFavorite: boolean) => {
        e.stopPropagation();
        setUpdatingFavorite(tripId);
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/trips/update-favorite/${tripId}?favorite_value=${!isFavorite}`);
            if (response.status === 200) {
                setTrips(trips.map(trip => 
                    trip.id === tripId ? { ...trip, favorite: !isFavorite } : trip
                ));
            } else {
                console.error('An error occurred while updating favorite status.');
            }
        } catch (error) {
            console.error('An error occurred while updating favorite status.', error);
        } finally {
            setUpdatingFavorite(null);
        }
    };

    const Loader = () => (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );

    const TripCard = ({ trip }: { trip: Trip }) => (
        <div 
            className="bg-white border rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
            onClick={() => handleCardClick(trip)}
        >
            <h2 className="text-xl font-bold mb-4 text-blue-600">
                <FaMapMarkerAlt className="inline-block mr-2" />
                Trip to {trip.destination.join(', ')}
            </h2>
            <p className="mb-2"><FaCalendarAlt className="inline-block mr-2 text-gray-600" /> {trip.start_date}</p>
            <p className="mb-2"><FaWallet className="inline-block mr-2 text-gray-600" /> ₹{trip.budget.toLocaleString()}</p>
            <p className="mb-2"><FaList className="inline-block mr-2 text-gray-600" /> {trip.interests.join(', ')}</p>
            <p><FaClock className="inline-block mr-2 text-gray-600" /> {trip.duration} days</p>
            <button
                className={`absolute top-2 right-2 text-2xl transition-colors duration-300 ${
                    trip.favorite ? 'text-red-500' : 'text-gray-300'
                } hover:text-red-500`}
                onClick={(e) => handleFavoriteClick(e, trip.id, trip.favorite)}
                disabled={updatingFavorite === trip.id}
            >
                {updatingFavorite === trip.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                ) : (
                    <FaHeart />
                )}
            </button>
        </div>
    );

    const TripDetail = ({ trip }: { trip: Trip }) => (
        <div className="bg-white border rounded-lg p-6 shadow-lg">
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600 transition-colors duration-300 flex items-center"
                onClick={() => setSelectedTrip(null)}
            >
                <FaArrowLeft className="mr-2" /> Back to My Trips
            </button>
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
                <FaMapMarkerAlt className="inline-block mr-2" />
                Trip to {trip.destination.join(', ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <p><FaWallet className="inline-block mr-2 text-gray-600" /> Budget: ₹{trip.budget.toLocaleString()}</p>
                <p><FaClock className="inline-block mr-2 text-gray-600" /> Duration: {trip.duration} days</p>
                <p><FaCalendarAlt className="inline-block mr-2 text-gray-600" /> Start Date: {trip.start_date}</p>
                <p><FaList className="inline-block mr-2 text-gray-600" /> Interests: {trip.interests.join(', ')}</p>
            </div>

            {trip.itineraries.map((itinerary, index) => (
                <div key={index} className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Itinerary for {itinerary.destination}</h3>
                    <p className="mb-2"><FaWallet className="inline-block mr-2 text-gray-600" /> Budget: ₹{itinerary.budget.toLocaleString()}</p>
                    <p className="mb-4"><FaClock className="inline-block mr-2 text-gray-600" /> Duration: {itinerary.duration} days</p>
                    {itinerary.itinerary.map((day) => (
                        <div key={day.day} className="mb-4">
                            <p className="font-bold text-lg mb-2">Day {day.day}</p>
                            <ul className="space-y-4">
                                {day.activities.map((activity, i) => (
                                    <li key={i} className="bg-white p-4 rounded-md shadow">
                                        <p className="font-semibold text-blue-600">{activity.name}</p>
                                        <p className="text-sm text-gray-600 mb-2">Cost: ₹{activity.cost.toLocaleString()}</p>
                                        <p className="text-sm">{activity.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">My Trips</h1>

                    {isLoading ? (
                        <Loader />
                    ) : !selectedTrip ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.length > 0 ? (
                                trips.map((trip) => (
                                    <TripCard key={trip.id} trip={trip} />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-600">No trips available.</p>
                            )}
                        </div>
                    ) : (
                        <TripDetail trip={selectedTrip} />
                    )}
                </div>
            }
        />
    );
}