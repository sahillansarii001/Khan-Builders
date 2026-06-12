'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext({
  settings: {},
  loading: true,
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = () => {
      axios.get('http://localhost:5000/api/settings')
        .then(res => {
          if (res.data) setSettings(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching settings', err);
          setLoading(false);
        });
    };

    fetchSettings();
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchSettings, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
