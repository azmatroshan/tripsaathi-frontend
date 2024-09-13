import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FavoriteTrips from './pages/FavoriteTrips';
import CreateTrip from './pages/CreateTrip';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/create-trip" element={<CreateTrip/>} />
        <Route path="/favorite-trips" element={<FavoriteTrips/>} />
      </Routes>
    </Router>
  );
}

export default App;
