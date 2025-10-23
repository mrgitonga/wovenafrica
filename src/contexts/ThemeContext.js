// src/contexts/ThemeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Default to dark mode, or use the user's saved preference
  const [theme, setTheme] = useState(localStorage.getItem('woven-africa-theme') || 'dark');

  useEffect(() => {
    // Apply the theme to the body and save the preference
    document.body.className = ''; // Clear existing theme classes
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('woven-africa-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};