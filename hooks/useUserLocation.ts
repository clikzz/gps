import { useLocationStore } from '@/stores/location';

export function useUserLocation() {
  const { position } = useLocationStore();

  const initial = position
    ? { latitude: position.latitude, longitude: position.longitude, zoom: 14 }
    : { latitude: -36.82699, longitude: -73.04977, zoom: 14 }; // Concepción, Chile

  const onMapLoad = (map: mapboxgl.Map) => {
    map.flyTo({
      center: [initial.longitude, initial.latitude],
      zoom: initial.zoom,
      essential: true,
    });
  };

  return { initial, onMapLoad };
}