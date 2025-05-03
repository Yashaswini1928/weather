import { useState, useEffect } from 'react';
import { UserSettings } from '@shared/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings as apiUpdateSettings } from '@/lib/api';

const defaultSettings: UserSettings = {
  useImperial: false,
  useImperialWind: false,
  darkMode: false,
  dynamicBg: true,
  weatherAlerts: true
};

export function useSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Fetch settings from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: getSettings,
    onSuccess: (data) => {
      setSettings(data);
    },
    onError: () => {
      // If API fails, use local storage as fallback
      const storedSettings = localStorage.getItem('weatherview-settings');
      if (storedSettings) {
        try {
          setSettings(JSON.parse(storedSettings));
        } catch (e) {
          // If parsing fails, use default settings
          setSettings(defaultSettings);
        }
      }
    }
  });

  // Update settings mutation
  const mutation = useMutation({
    mutationFn: apiUpdateSettings,
    onSuccess: (data) => {
      setSettings(data);
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      // Save to local storage as backup
      localStorage.setItem('weatherview-settings', JSON.stringify(data));
    },
    onError: () => {
      // If API fails, at least store in local storage
      localStorage.setItem('weatherview-settings', JSON.stringify(settings));
    }
  });

  // Load settings from local storage on initial load
  useEffect(() => {
    const storedSettings = localStorage.getItem('weatherview-settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        // If parsing fails, use default settings
        console.error('Failed to parse stored settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    mutation.mutate(newSettings);
  };

  return {
    settings,
    updateSettings,
    isLoading,
    isError
  };
}
