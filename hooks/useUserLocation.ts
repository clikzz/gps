import { useState } from 'react';
import { useLocationStore } from '@/stores/location';

export function useUserLocation() {
  const [error, setError] = useState<string | null>(null);
  const { position, setPosition } = useLocationStore();

  // Fallback a Concepción como ubicacion inicial
  const fallback = { latitude: -36.82699, longitude: -73.04977, zoom: 14 };
  const initial = position && (Date.now() - position.timestamp < 5 * 60 * 1000)
    ? { latitude: position.latitude, longitude: position.longitude, zoom: 14 }
    : fallback;

  function onMapLoad(map: mapboxgl.Map) {
    // Si ya hay posición reciente, no pide geolocalización
    if (position && (Date.now() - position.timestamp < 5 * 60 * 1000)) {
      return;
    }

    // Si no, pide geolocalización
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada en este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setError(null);
        const pos = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: Date.now()
        };
        setPosition(pos);
        map.flyTo({ 
          center: [coords.longitude, coords.latitude], 
          zoom: 14, 
          essential: true 
        });
      },
      (err) => setError('Error obteniendo ubicación: ' + err.message),
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 5 * 60 * 1000 
      }
    );
  }

  return { initial, error, onMapLoad };
}