
"use client";
import { useEffect, useState } from 'react';

interface PetData {
  id: string;
  name: string;
  photo_url?: string | null;
}

interface PetTimelineHeaderProps {
  petId: string;
}

export default function PetTimelineHeader({ petId }: PetTimelineHeaderProps) {
  const [petData, setPetData] = useState<PetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (petId) {
      setIsLoading(true);
      setError(null);
      const fetchPetDetails = async () => {
        try {
          const response = await fetch(`/api/pets/${petId}`); 
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error al cargar datos de la mascota: ${response.statusText}`);
          }
          const data: PetData = await response.json();
          setPetData(data);
        } catch (err: any) {
          console.error("Error fetching pet details:", err);
          setError(err.message || 'Ocurrió un error desconocido al cargar datos de la mascota.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPetDetails();
    }
  }, [petId]);

  if (isLoading) return <p>Cargando información de la mascota...</p>;
  if (error) return <p>Error al cargar información de la mascota: {error}</p>;
  if (!petData) return <p>No se encontró la mascota.</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      {petData.photo_url ? (
        <img
          src={petData.photo_url}
          alt={`Foto de ${petData.name}`}
          style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'12px', textAlign:'center' }}>
          Sin foto
        </div>
      )}
      <h1>Timeline de {petData.name}</h1>
    </div>
  );
}