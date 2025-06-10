import { useState } from 'react';
import { useLocationStore } from '@/stores/location';

async function fetchGeoByIP() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('Error IP Geo');
    const data = await res.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: Date.now()
    };
  } catch (e) {
    console.error('IP geolocation falló:', e);
    return null;
  }
}

export function useUserLocation() {
  const [error, setError] = useState<string | null>(null);
  const { position, setPosition } = useLocationStore();

  // Fallback Concepcion
  const fallback = { latitude: -36.82699, longitude: -73.04977, zoom: 14 };

  // Si ya hay posición reciente, usarla
  const initial =
    position && Date.now() - position.timestamp < 5 * 60 * 1000
      ? { latitude: position.latitude, longitude: position.longitude, zoom: 14 }
      : fallback;

  async function onMapLoad(map: mapboxgl.Map) {
    // Si ya hay algo reciente, ir a esa posición
    if (position && Date.now() - position.timestamp < 5 * 60 * 1000) {
      map.flyTo({ center: [position.longitude, position.latitude], zoom: 14, essential: true });
      return;
    }

    // Intentar geolocalización nativa
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setError(null);
          const pos = { latitude: coords.latitude, longitude: coords.longitude, timestamp: Date.now() };
          setPosition(pos);
          map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14, essential: true });
        },
        async () => {
          // Si falla (o no HTTPS), fallback a IP
          const ipPos = await fetchGeoByIP();
          if (ipPos) {
            setError(null);
            setPosition(ipPos);
            map.flyTo({ center: [ipPos.longitude, ipPos.latitude], zoom: 14, essential: true });
          } else {
            setError('No se pudo obtener ubicación');
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Sin geolocalización nativa, se usa IP
      const ipPos = await fetchGeoByIP();
      if (ipPos) {
        setError(null);
        setPosition(ipPos);
        map.flyTo({ center: [ipPos.longitude, ipPos.latitude], zoom: 14, essential: true });
      } else {
        setError('No se pudo obtener ubicación');
      }
    }
  }

  return { initial, error, onMapLoad };
}