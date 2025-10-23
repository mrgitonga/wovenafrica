// src/components/HolographicCard.js

import React, { useState } from 'react';
import '../styles/HolographicCard.css';
import {
  Heart, Shield, Award, BadgeCheck, MapPin, Globe, Phone, Mail, Clock,
  Facebook, Instagram, Linkedin, CreditCard, Wallet, Smartphone
} from 'lucide-react';

import xLogo from '../assets/x-logo.svg';
import tiktokLogo from '../assets/tiktok.svg';
import bitcoinLogo from '../assets/bitcoin.svg';

// --- HELPER FUNCTIONS ---

// Parses the special [Text](URL) format for clickable badges.
const parseLinkableItem = (itemString) => {
  const match = itemString.match(/\[(.*?)\]\((.*?)\)/);
  if (match && match[1] && match[2]) {
    return { text: match[1].trim(), url: match[2].trim() };
  }
  return { text: itemString.trim(), url: null };
};

// Converts the sheet key (e.g., 'atmoney') into a display-friendly name.
const getPaymentDisplayName = (key) => {
  const displayNameMap = {
    'mpesa': 'M-Pesa',
    'atmoney': 'Airtel Money',
    'cash': 'Cash',
    'card': 'Card',
    'bitcoin': 'Bitcoin',
    'other': 'Other',
  };
  return displayNameMap[key] || key;
};

// --- DEFINITIVE FIX for Icon Logic ---
// This single function now reliably returns the correct icon based on the sheet key.
const getPaymentIcon = (key) => {
  switch (key) {
    case 'mpesa':
    case 'atmoney':
      return <Smartphone className="icon" />;
    case 'card':
      return <CreditCard className="icon" />;
    case 'bitcoin':
      return <img src={bitcoinLogo} alt="Bitcoin" className="icon-svg" />;
    case 'cash':
      return <Wallet className="icon" />;
    case 'other':
    default:
      return <Wallet className="icon" />; // Fallback for 'other' or unknown types
  }
};

const getSocialLink = (platform, handle) => {
    switch (platform) {
      case 'Facebook': return `https://facebook.com/${handle.replace('/', '')}`;
      case 'X': return `https://x.com/${handle.replace('@', '')}`;
      case 'Instagram': return `https://instagram.com/${handle.replace('@', '')}`;
      case 'Linkedin': return `https://linkedin.com/company/${handle.replace('/', '')}`;
      case 'Tiktok': return `https://tiktok.com/@${handle.replace('@', '')}`;
      default: return '#';
    }
};

const HolographicCard = ({ profile }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${profile.locationLat},${profile.locationLng}`;
  const [isMuted, setIsMuted] = useState(true);
  const handleUnmute = () => setIsMuted(false);
  const getYouTubeUrl = (videoId) => {
    const params = new URLSearchParams({ autoplay: '1', loop: '1', controls: '1', playlist: videoId });
    if (isMuted) params.append('mute', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  return (
    <div className="holographic-card">
      <div className="card-scroll-content">
        
        <div className="card-header">
          <span className="category-badge">{profile.category}</span>
          {profile.licenseStatus === 'verified' && (
            <div className="verified-status"><BadgeCheck/> VERIFIED</div>
          )}
        </div>
        <h1 className="company-name">{profile.companyName}</h1>
        
        <div className="header-divider"></div>

        {/* --- DEFINITIVE FIX for Description --- */}
        {/* It is now wrapped in a .section div to guarantee consistent spacing. */}
        {profile.description && (
          <div className="section">
            <p className="company-description">{profile.description}</p>
          </div>
        )}

        <div className="status-grid">
          {profile.healthStatus && (
            <div className="status-box">
              <Heart className="icon primary" />
              <div>
                <p className="status-label">HEALTH STATUS</p>
                <p className="status-value excellent">{profile.healthStatus}</p>
              </div>
            </div>
          )}
          {profile.securityProvider && (
            <div className="status-box">
              <Shield className="icon accent" />
              <div>
                <p className="status-label">SECURITY</p>
                <p className="status-value">{profile.securityProvider}</p>
              </div>
            </div>
          )}
        </div>

        {profile.youtubeId && (
          <div className="video-portal">
            <div className="video-container youtube-container">
              {isMuted && (
                <div className="unmute-overlay" onClick={handleUnmute}>
                  <div className="unmute-text">Click to Unmute</div>
                </div>
              )}
              <iframe
                src={getYouTubeUrl(profile.youtubeId)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {(profile.awards || profile.badges) && (
          <div className="section">
            <p className="section-title"><Award className="icon"/> AWARDS & CERTIFICATIONS</p>
            <div className="badge-container">
              {profile.awards && (Array.isArray(profile.awards) ? profile.awards : [profile.awards]).map((item, i) => {
                const parsed = parseLinkableItem(item);
                return parsed.url ? <a key={i} href={parsed.url} target="_blank" rel="noopener noreferrer" className="badge primary">{parsed.text}</a> : <span key={i} className="badge primary">{parsed.text}</span>;
              })}
              {profile.badges && (Array.isArray(profile.badges) ? profile.badges : [profile.badges]).map((item, i) => {
                const parsed = parseLinkableItem(item);
                return parsed.url ? <a key={i} href={parsed.url} target="_blank" rel="noopener noreferrer" className="badge accent">{parsed.text}</a> : <span key={i} className="badge accent">{parsed.text}</span>;
              })}
            </div>
          </div>
        )}
        
        {/* --- UPDATED: General Info with Clickable Phone/Email --- */}
        {(profile.contactPhone || profile.contactEmail || profile.website || profile.openHours) && (
          <div className="section">
            <p className="section-title">GENERAL INFORMATION</p>
            <div className="info-grid">
                {profile.contactPhone && <div className="info-item"><div className="info-label"><Phone className="icon"/> Phone</div><a className="info-link" href={`tel:${profile.contactPhone}`}>{profile.contactPhone}</a></div>}
                {profile.contactEmail && <div className="info-item"><div className="info-label"><Mail className="icon"/> Email</div><a className="info-link" href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a></div>}
                {profile.website && <div className="info-item"><div className="info-label"><Globe className="icon"/> Website</div><a className="info-link" href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></div>}
                {profile.openHours && <div className="info-item"><div className="info-label"><Clock className="icon"/> Hours</div>{profile.openHours}</div>}
            </div>
          </div>
        )}
        
        {(profile.socialFacebook || profile.socialX || profile.socialInstagram || profile.socialLinkedin || profile.socialTiktok) && (
          <div className="section">
            <p className="section-title">SOCIAL MEDIA</p>
            <div className="social-links-grid">
              {profile.socialFacebook && <a href={getSocialLink('Facebook', profile.socialFacebook)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Facebook className="icon" /><span>{profile.socialFacebook}</span></a>}
              {profile.socialX && <a href={getSocialLink('X', profile.socialX)} target="_blank" rel="noopener noreferrer" className="social-link-item"><img src={xLogo} alt="X logo" className="icon-svg"/><span>{profile.socialX}</span></a>}
              {profile.socialInstagram && <a href={getSocialLink('Instagram', profile.socialInstagram)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Instagram className="icon" /><span>{profile.socialInstagram}</span></a>}
              {profile.socialTiktok && <a href={getSocialLink('Tiktok', profile.socialTiktok)} target="_blank" rel="noopener noreferrer" className="social-link-item"><img src={tiktokLogo} alt="TikTok logo" className="icon-svg"/><span>{`@${profile.socialTiktok.replace('@','')}`}</span></a>}
              {profile.socialLinkedin && <a href={getSocialLink('Linkedin', profile.socialLinkedin)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Linkedin className="icon" /><span>{profile.socialLinkedin}</span></a>}
            </div>
          </div>
        )}

        {profile.paymentMethods && (
          <div className="section">
            <p className="section-title">PAYMENT METHODS</p>
            <div className="badge-container">
              {(Array.isArray(profile.paymentMethods) ? profile.paymentMethods : [profile.paymentMethods]).map((item, i) => {
                const cleanItemKey = item.trim().toLowerCase();
                const displayName = getPaymentDisplayName(cleanItemKey);
                const icon = getPaymentIcon(cleanItemKey);
                return (
                  <span key={i} className={`payment-method-item payment-method--${cleanItemKey}`}>
                    {icon} {displayName}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {profile.locationAddress && (
          <div className="section">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-box">
                <MapPin className="icon primary" />
                <div>
                  <p className="status-label">LOCATION</p>
                  <p className="location-address">{profile.locationAddress}</p>
                </div>
            </a>
          </div>
        )}

        {profile.attributions && (
          <div className="section">
              <p className="section-title">ATTRIBUTIONS</p>
              <p className="attributions-text">{profile.attributions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolographicCard;