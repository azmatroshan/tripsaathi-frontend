import React, { useEffect, useState } from 'react';
import { FaPlane, FaCalendarAlt, FaPlus, FaTrash, FaWallet, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Layout from "../components/Layout";
import Snackbar from "../components/Snackbar";
import InputField from "../components/InputField";
import axios from 'axios';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    user_id: localStorage.getItem('user_id') || "",
    destination: [''],
    budget: '',
    start_date: '',
    duration: '',
    interests: [] as string[]
  });
  const [customInterest, setCustomInterest] = useState('');

  const navigation = {
    pages: [
      { name: 'Create a Trip', to: '/create-trip', selected: true },
      { name: 'Favorite Trips', to: '/favorite-trips', selected: false },
    ],
    user: [
      { name: 'Log out', to: '/' },
    ],
  }

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...tripData.destination];
    newDestinations[index] = value;
    setTripData({ ...tripData, destination: newDestinations });
  };

  const addDestination = () => {
    setTripData({ ...tripData, destination: [...tripData.destination, ''] });
  };

  const removeDestination = (index: number) => {
    const newDestinations = tripData.destination.filter((_, i) => i !== index);
    setTripData({ ...tripData, destination: newDestinations });
  };

  const handleInterestToggle = (interest: string) => {
    setTripData(prevData => ({
      ...prevData,
      interests: prevData.interests.includes(interest)
        ? prevData.interests.filter(i => i !== interest)
        : [...prevData.interests, interest]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest && !tripData.interests.includes(customInterest)) {
      setTripData({
        ...tripData,
        interests: [...tripData.interests, customInterest]
      });
      setCustomInterest('');
    }
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
      const formattedDestination = tripData.destination.map(dest => dest.trim());

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/trips/create`, 
        {
          ...tripData,
          destination: formattedDestination,
          budget: parseInt(tripData.budget),
          duration: parseInt(tripData.duration),
          interests: tripData.interests.map(interest => interest.trim()),
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
          destination: [],
          budget: "",
          start_date: "",
          duration: "",
          interests: [],
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

  const isStepValid = () => {
    switch(step) {
      case 1:
        return tripData.destination.every(dest => dest.trim() !== '') && tripData.budget !== '';
      case 2:
        return tripData.start_date !== '' && tripData.duration !== '';
      case 3:
        return tripData.interests.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Where do you want to go?</h2>
            <p className="text-gray-600 mb-4">Add one or more destinations for your trip.</p>
            {tripData.destination.map((dest, index) => (
              <div key={index} className="flex items-center mb-4">
                <InputField
                  icon={<FaPlane className="text-gray-400" />}
                  label={`Destination ${index + 1}`}
                  name={`destination-${index}`}
                  type="text"
                  value={dest}
                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                  placeholder="Enter a destination"
                  disabled={loading}
                />
                {index > 0 && (
                  <button
                    onClick={() => removeDestination(index)}
                    className="ml-4 mt-4 text-red-500 hover:text-red-700"
                    aria-label="Remove destination"
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addDestination}
              className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
              disabled={loading}
            >
              <FaPlus className="mr-2" /> Add another destination
            </button>
            <InputField
              icon={<FaWallet className="text-gray-400" />}
              label="Budget (₹)"
              name="budget"
              type="number"
              value={tripData.budget}
              onChange={handleInputChange}
              placeholder="Enter your budget"
              disabled={loading}
            />
            <button
              onClick={() => setStep(2)}
              className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-md transition duration-300 ${isStepValid() && !loading ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isStepValid() || loading}
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">When are you going?</h2>
            <p className="text-gray-600 mb-4">Choose your start date and trip duration.</p>
            <InputField
              icon={<FaCalendarAlt className="text-gray-400" />}
              label="Start Date"
              name="start_date"
              type="date"
              value={tripData.start_date}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={<FaClock className="text-gray-400" />}
              label="Duration (days)"
              name="duration"
              type="number"
              value={tripData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              disabled={loading}
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className={`bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ${isStepValid() && !loading ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isStepValid() || loading}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tell us what you're interested in</h2>
            <p className="text-gray-600 mb-4">Select all that apply or add your own.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {['Must-see Attractions', 'Great Food', 'Hidden Gems', 'Historical Landmarks', 'Religious Sites', 'Markets and Shopping', 'Nature and Wildlife', 'Wine & Beer', 'Outdoors', 'Culture', 'Arts & Theatre', 'Adventure and Sports'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`py-2 px-4 rounded-md text-sm ${
                    tripData.interests.includes(interest)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } hover:opacity-80 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add a custom interest"
                className={`flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'bg-gray-100' : ''}`}
                disabled={loading}
              />
              <button
                onClick={addCustomInterest}
                className={`bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tripData.interests.map((interest) => (
                <span key={interest} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  {interest}
                </span>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className={`bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ${isStepValid() && !loading ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isStepValid() || loading}
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      childHeader={<Header navigation={navigation} />}
      childBody={
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-lg">
          {renderStep()}
          {snackbar && (
            <Snackbar message={snackbar.message} type={snackbar.type} />
          )}
        </div>
      }
    />
  );
}
