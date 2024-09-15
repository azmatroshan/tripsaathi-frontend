import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import Trip from "../interfaces/Trip";
import TripCard from "../components/TripCard";
import { useNavigate } from "react-router";

const Loader = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
);

export default function FavoriteTrips() {
    const navigation = {
        pages: [
            { name: 'Create a Trip', to: '/create-trip', selected: false },
            { name: 'Favorite Trips', to: '/favorite-trips', selected: true },
        ],
        user: [
            { name: 'Log out', to: '/' },
        ],
    }

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingFavorite, setUpdatingFavorite] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoriteTrips = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('user_id');
                if (userId) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/trips/favorite?user_id=${userId}`);
                    if (response.status === 200) {
                        setTrips(response.data);
                    } else {
                        console.error('An error occurred while fetching favorite trips.');
                    }
                } else {
                    console.error('User ID not found.');
                }
            } catch (error) {
                console.error('An error occurred while fetching favorite trips.', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteTrips();
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

    return (
        <Layout
            childHeader={<Header navigation={navigation} />}
            childBody={
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">My Favorite Trips</h1>

                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.length > 0 ? (
                                trips.filter(trip => trip.favorite).map((trip) => (
                                    <TripCard 
                                        key={trip.id} 
                                        trip={trip} 
                                        onCardClick={handleCardClick}
                                        onFavoriteClick={handleFavoriteClick}
                                        updatingFavorite={updatingFavorite}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-600">No favorite trips available.</p>
                            )}
                        </div>
                    ) 
                }
                </div>
            }
        />
    );
}