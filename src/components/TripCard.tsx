import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaWallet, FaList, FaClock, FaHeart, FaShare } from 'react-icons/fa';
import Trip from "../interfaces/Trip";

interface TripCardProps {
    trip: Trip;
    onCardClick: (trip: Trip) => void;
    onFavoriteClick: (e: React.MouseEvent, tripId: number, isFavorite: boolean) => void;
    updatingFavorite: number | null;
}

export default function TripCard({ trip, onCardClick, onFavoriteClick, updatingFavorite }: TripCardProps) {

    const handleShareClick = (e: React.MouseEvent, tripId: number) => {
        e.stopPropagation();
    
        const tripUrl = `${window.location.origin}/trip/${tripId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out this trip!',
                text: 'Here is a trip you might be interested in.',
                url: tripUrl,
            }).then(() => {
                console.log('Trip shared successfully.');
            }).catch((error) => {
                console.error('An error occurred while sharing:', error);
            });
        } else {
            navigator.clipboard.writeText(tripUrl)
                .then(() => {
                    console.log('Trip URL copied to clipboard.');
                    alert('Trip URL copied to clipboard!');
                })
                .catch((error) => {
                    console.error('An error occurred while copying the URL:', error);
                });
        }
    };

    return (
        <div
            className="bg-white border rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
            onClick={() => onCardClick(trip)}
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
                className={`absolute top-2 right-12 text-2xl transition-colors duration-300 ${trip.favorite ? 'text-red-500' : 'text-gray-300'
                    } hover:text-red-500`}
                onClick={(e) => onFavoriteClick(e, trip.id, trip.favorite)}
                disabled={updatingFavorite === trip.id}
            >
                {updatingFavorite === trip.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                ) : (
                    <FaHeart />
                )}
            </button>
            <button
                className={`absolute top-2 right-3 text-2xl transition-colors duration-300 text-gray-300 hover:text-blue-600`}
                onClick={(e) => handleShareClick(e, trip.id)}
            >
                <FaShare />
            </button>
        </div>
    );
}

