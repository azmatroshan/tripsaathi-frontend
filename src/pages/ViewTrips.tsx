import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import Trip from "../interfaces/Trip";
import TripCard from "../components/TripCard";
import { useNavigate } from "react-router";

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
    const [isLoading, setIsLoading] = useState(true);
    const [updatingFavorite, setUpdatingFavorite] = useState<number | null>(null);
    const navigate = useNavigate();

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
        navigate(`/trip/${trip.id}`, { state: { trip } });
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

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">My Trips</h1>

                    {isLoading ? (
                        <Loader />
                    ) :  (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.length > 0 ? (
                                trips.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        onCardClick={handleCardClick}
                                        onFavoriteClick={handleFavoriteClick}
                                        updatingFavorite={updatingFavorite}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-600">No trips available.</p>
                            )}
                        </div>
                    ) }
                </div>
            }
        />
    );
}