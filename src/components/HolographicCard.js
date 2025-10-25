// src/components/HolographicCard.js

import React from 'react';
import '../styles/HolographicCard.css';
import {
  Heart, Shield, Award, BadgeCheck, MapPin, Globe, Phone, Mail, Clock,
  Facebook, Instagram, Linkedin, CreditCard, Wallet, Smartphone
} from 'lucide-react';

import xLogo from '../assets/x-logo.svg';
import tiktokLogo from '../assets/tiktok.svg';
import bitcoinLogo from '../assets/bitcoin.svg';
import whatsappLogo from '../assets/whatsapp.svg';
import VideoCarousel from './VideoCarousel'; // Import the new carousel component

// --- HELPER FUNCTIONS ---
const StatusBox = ({ icon, label, value, url }) => {
  const content = (
    <>
      {icon}
      <div>
        <p className="status-label">{label}</p>
        <p className={`status-value ${label === 'HEALTH STATUS' ? 'excellent' : ''}`}>{value}</p>
      </div>
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="status-box">
        {content}
      </a>
    );
  }
  return <div className="status-box">{content}</div>;
};
// This helper function parses a string to see if it matches the [Text](URL) format for badges/awards.
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

// Returns the correct icon based on the sheet key.
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
    case 'other':
    default:
      return <Wallet className="icon" />;
  }
};

const getSocialLink = (platform, handle) => {
  // Ensure the handle is always a string to prevent .replace errors
  const handleAsString = (handle || '').toString();
  switch (platform) {
    case 'Facebook': return `https://facebook.com/${handleAsString.replace('/', '')}`;
    case 'X': return `https://x.com/${handleAsString.replace('@', '')}`;
    case 'Instagram': return `https://instagram.com/${handleAsString.replace('@', '')}`;
    case 'Linkedin': return `https://linkedin.com/company/${handleAsString.replace('/', '')}`;
    case 'Tiktok': return `https://tiktok.com/@${handleAsString.replace('@', '')}`;
    case 'Whatsapp':
      const phoneNumber = handleAsString.replace(/[\s-()+]/g, '');
      return `https://wa.me/${phoneNumber}`;
    default: return '#';
  }
};

const HolographicCard = ({ profile }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${profile.locationLat},${profile.locationLng}`;

  // Parse the YouTube ID string into an array, then reverse it so the newest video is first.
  let youtubeIds = [];
  if (profile.youtubeId && typeof profile.youtubeId === 'string') {
    youtubeIds = profile.youtubeId.split(';').map(id => id.trim()).reverse();
  }
  // Parse health and security fields
  const healthInfo = parseLinkableItem(profile.healthStatus || '');
  const securityInfo = parseLinkableItem(profile.securityProvider || '');

  return (
    <div className="holographic-card">
      <div className="card-scroll-content">

        {/* --- SECTION 1: Header with new BadgeCheck icon --- */}
        <div className="card-header">
          <span className="category-badge">{profile.category}</span>
          {profile.licenseStatus === 'verified' && ( <div className="verified-status"><BadgeCheck /> VERIFIED</div> )}
        </div>
        <h1 className="company-name">{profile.companyName}</h1>
        <div className="header-divider"></div>
        
        {/* --- SECTION 2: Description --- */}
        {profile.description && (
          <div className="section">
            <p className="company-description">{profile.description}</p>
          </div>
        )}

        {/* --- SECTION 3: Video Carousel --- */}
        {youtubeIds.length > 0 && (
          <div className="video-portal">
            <VideoCarousel youtubeIds={youtubeIds} />
          </div>
        )}

        {/* --- SECTION 4: Health & Security --- */}
        <div className="status-grid">
          {profile.healthStatus && (
            <StatusBox icon={<Heart className="icon primary" />} label="HEALTH STATUS" value={healthInfo.text} url={healthInfo.url} />
          )}
          {profile.securityProvider && (
            <StatusBox icon={<Shield className="icon accent" />} label="SECURITY" value={securityInfo.text} url={securityInfo.url} />
          )}
        </div>

        {/* --- SECTION ORDER 5: Awards & Certifications --- */}
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

        {/* --- SECTION ORDER 6: General information --- */}        
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

        {/* --- SECTION ORDER 7: Social Media --- */}
        {(profile.socialFacebook || profile.socialX || profile.socialInstagram || profile.socialLinkedin || profile.socialTiktok || profile.socialWhatsapp) && (
          <div className="section">
            <p className="section-title">SOCIAL MEDIA</p>
            <div className="social-links-container">
              {profile.socialWhatsapp && <a href={getSocialLink('Whatsapp', profile.socialWhatsapp)} target="_blank" rel="noopener noreferrer" className="social-link-item"><img src={whatsappLogo} alt="WhatsApp logo" className="icon-svg"/><span>{(profile.socialWhatsapp || '').toString()}</span></a>}
              {profile.socialFacebook && <a href={getSocialLink('Facebook', profile.socialFacebook)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Facebook className="icon" /><span>{profile.socialFacebook}</span></a>}
              {profile.socialTiktok && <a href={getSocialLink('Tiktok', profile.socialTiktok)} target="_blank" rel="noopener noreferrer" className="social-link-item"><img src={tiktokLogo} alt="TikTok logo" className="icon-svg"/><span>{`@${(profile.socialTiktok || '').toString().replace('@','')}`}</span></a>}
              {profile.socialInstagram && <a href={getSocialLink('Instagram', profile.socialInstagram)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Instagram className="icon" /><span>{profile.socialInstagram}</span></a>}
              {profile.socialX && <a href={getSocialLink('X', profile.socialX)} target="_blank" rel="noopener noreferrer" className="social-link-item"><img src={xLogo} alt="X logo" className="icon-svg"/><span>{profile.socialX}</span></a>}
              {profile.socialLinkedin && <a href={getSocialLink('Linkedin', profile.socialLinkedin)} target="_blank" rel="noopener noreferrer" className="social-link-item"><Linkedin className="icon" /><span>{profile.socialLinkedin}</span></a>}
            </div>
          </div>
        )}

        {/* --- SECTION ORDER 8: Payment Methods --- */}
        {profile.paymentMethods && (
          <div className="section">
            <p className="section-title">PAYMENT METHODS</p>
            <div className="badge-container">
              {(Array.isArray(profile.paymentMethods) ? profile.paymentMethods : [profile.paymentMethods]).map((item, i) => {
                const cleanItemKey = item.trim().toLowerCase();
                const displayName = getPaymentDisplayName(cleanItemKey);
                const icon = getPaymentIcon(cleanItemKey);
                return ( <span key={i} className={`payment-method-item payment-method--${cleanItemKey}`}>{icon} {displayName}</span> );
              })}
            </div>
          </div>
        )}

        {/* --- SECTION ORDER 9: Location --- */}
        {profile.locationAddress && (
          <div className="section">
            <p className="section-title">LOCATION</p>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-box">
                <MapPin className="icon primary" />
                <p className="location-address">{profile.locationAddress}</p>
            </a>
          </div>
        )}

        {/* --- SECTION ORDER 10: Attributions --- */}
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