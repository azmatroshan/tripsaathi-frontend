import { FaMapMarkerAlt, FaCalendarAlt, FaWallet, FaList, FaClock } from 'react-icons/fa';
import Trip from "../interfaces/Trip";

interface TripProps {
    trip: Trip;
}

export default function TripDetail({ trip }: TripProps) {

    return (
        <div className="bg-white border rounded-lg p-6 shadow-lg">
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
}