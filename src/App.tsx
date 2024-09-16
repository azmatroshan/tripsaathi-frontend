import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FavoriteTrips from './pages/FavoriteTrips';
import CreateTrip from './pages/CreateTrip';
import TripPage from './pages/TripPage';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route element={<ProtectedRoutes />}>
        <Route path="/create-trip" element={<CreateTrip/>} />
        <Route path="/favorite-trips" element={<FavoriteTrips/>} />
        </Route>
        <Route path="/trip/:trip_id" element={<TripPage />} />
      </Routes>
    </Router>
  );
}

export default App;
