import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import isLoggedIn from "../utils/isLoggedIn";
import Trip from "../interfaces/Trip";
import axios from "axios";
import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import TripDetail from "../components/TripDetail";


export default function TripPage() {

    const location = useLocation(); 
    const [trip, setTrip] = useState<Trip | null>(location.state?.trip || null);
    const [loading, setLoading] = useState(!location.state?.trip); 

    const { trip_id } = useParams<{ trip_id: string }>()

    const Loader = () => (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );

    const navigationForLoggedInUser = {
        pages: [
            { name: 'Create a Trip', to: '/create-trip', selected: false },
            { name: 'Favorite Trips', to: '/favorite-trips', selected: false },
        ],
        user: [
            { name: 'Log out', to: '/' },
        ],
    }

    const navigationForGuest = {
        pages: [],
        user: [
            { name: 'Log in', to: '/login' },
            { name: 'Sign up', to: '/signup' },
        ],
    }

    useEffect(() => {
        const fetchTrip = async () => {
            if(!trip) {
                setLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/trips/${trip_id}`);
                    if (response.status === 200) {
                        setTrip(response.data);
                    } else {
                        console.error('An error occurred while fetching favorite trips.');
                    }
                } catch (error) {
                    console.error('An error occurred while fetching favorite trips.', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTrip();
    }, [trip_id, trip]);

    return (
        isLoggedIn() ? (
            <Layout 
                childHeader={ <Header navigation={navigationForLoggedInUser}/> }
                childBody={
                    loading? (
                        <Loader />
                    ): (
                        trip ? (
                            <TripDetail trip={trip} />
                        ): (
                            <div className="text-center text-red-500">Trip not found.</div>
                        )
                    )
                }
            />
        ): (
            <Layout
                childHeader={ <Header navigation={navigationForGuest}/> }
                childBody={
                    loading? (
                        <Loader />
                    ): (
                        trip ? (
                            <TripDetail trip={trip} />
                        ): (
                            <div className="text-center text-red-500">Trip not found.</div>
                        )
                    )
                }
            />
        )
    );

}