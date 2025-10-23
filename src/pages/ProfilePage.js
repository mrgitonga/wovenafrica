// src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HolographicCard from '../components/HolographicCard';
import GridBackground from '../components/GridBackground';
import { useTheme } from '../contexts/ThemeContext';
import wovenAfricaLogo from '../assets/woven-africa.png';
import { QrCode, Sun, Moon } from 'lucide-react';

import '../styles/GridBackground.css';
import '../styles/HolographicCard.css';

const ProfilePage = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme, toggleTheme } = useTheme();  

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}?id=${profileId}&v=${new Date().getTime()}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  if (loading) {
    return (
      <div className="loading-container">
        <img src={wovenAfricaLogo} alt="Woven Africa Loading" className="loading-logo" />
        <div className="loader"></div>
      </div>
    );
  }

  if (error) return <div className="status-message">CONNECTION ERROR: {error}</div>;
  if (!profile) return <div className="status-message">PROFILE NOT FOUND</div>;

  return (
    <div className="profile-page-container">
      <GridBackground />
      {/* --- THIS IS THE CHANGE: ThemeToggle is now outside the header --- */}

      <header className="page-header">
        <button className="portal-title-button" onClick={toggleTheme}>
           <QrCode className="qr-icon" />
           <h1>QR ACCESS PORTAL</h1>
           <div className="theme-indicator">
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </div>
        </button>
      </header>

      <main className="main-content">
        <HolographicCard profile={profile} />
      </main>

      <footer className="page-footer">
        <Link to="/">
          <img src={wovenAfricaLogo} alt="Woven Africa Home" className="footer-logo" />
        </Link>
        <div className="footer-text">
          <p>WOVEN AFRICA</p>
          <span>Smart. Seamless. African.</span>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;