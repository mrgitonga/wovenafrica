// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage'; // Import the new Home Page
import './App.css';
import './styles/VideoCarousel.css'; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/profile/:profileId" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} /> {/* Set Home Page as the root route */}
      </Routes>
    </div>
  );
}

export default App;