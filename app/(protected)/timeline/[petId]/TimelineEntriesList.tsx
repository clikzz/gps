
"use client";
import React, { useEffect, useState } from 'react';


export interface TimelineEntryData {
  id: string;                 
  user_id: string;           
  pet_id: string;             
  title?: string | null;
  description?: string | null;
  event_date: string;        
  created_at: string;
  updated_at: string;
  TimelineEntryPhotos: Array<{ 
    id: string;              
    timeline_entry_id: string;
    photo_url: string;
    order?: number | null;
    created_at: string;
  }>;
  
}

interface TimelineEntriesListProps {
  petId: string;
  
}

export default function TimelineEntriesList({ petId }: TimelineEntriesListProps) {
  const [entries, setEntries] = useState<TimelineEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) return;

    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/timeline/${petId}/entries`); 
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error al obtener las entradas del timeline (HTTP ${response.status})`);
        }
        const data: TimelineEntryData[] = await response.json();
        setEntries(data);
      } catch (err: any) {
        console.error("Error fetching timeline entries:", err);
        setError(err.message || 'Ocurrió un error al cargar los recuerdos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [petId]); 

  if (isLoading) {
    return <p style={{ marginTop: "20px" }}>Cargando recuerdos...</p>;
  }

  if (error) {
    return <p style={{ marginTop: "20px", color: 'red' }}>Error al cargar recuerdos: {error}</p>;
  }

  return (
    <div style={{marginTop: "20px", borderTop: "1px dashed #555", paddingTop: "20px"}}>
      <h2>Recuerdos Guardados:</h2>
      {entries.length === 0 ? (
        <p>Aún no hay recuerdos para esta mascota.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map((entry) => (
            <li key={entry.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
              {entry.title && <h4 style={{ marginTop: 0, marginBottom: '5px' }}>{entry.title}</h4>}
              <p style={{ fontSize: '0.9em', color: '#aaa' }}>
                Fecha: {new Date(entry.event_date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {entry.description && <p>{entry.description}</p>}
              <div>
                {entry.TimelineEntryPhotos && entry.TimelineEntryPhotos.length > 0 ? (
                  entry.TimelineEntryPhotos.map((photo) => ( 
                    <img
                      key={photo.id || photo.photo_url} 
                      src={photo.photo_url}
                      alt={entry.title || `Recuerdo del ${new Date(entry.event_date).toLocaleDateString()}`}
                      style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #555' }}
                    />
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic' }}>(Entrada sin foto)</p>
                )}
              </div>
              {}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}