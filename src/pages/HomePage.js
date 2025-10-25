// src/pages/HomePage.js
import React from 'react';
import wovenAfricaLogo from '../assets/woven-africa.png';
import { Mail, Phone } from 'lucide-react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="home-content">
        <img src={wovenAfricaLogo} alt="Woven Africa" className="home-logo" />
        {/* The <h1> title has been removed */}
        <div className="contact-info">
          <p className="contact-title">Contact Us</p>
          <a href="mailto:e.nyagaanderson@gmail.com" className="contact-item">
            <Mail className="icon" /> e.nyagaanderson@gmail.com
          </a>
          <a href="tel:+254757759828" className="contact-item">
            <Phone className="icon" /> +254 757 759 828
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;