
"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewTimelineEntryFormProps {
  petId: string;
  onSuccess: () => void; 
}

interface UploadApiResponse {
  url: string;
  type: string;
  path: string;
}


interface TimelineEntryApiResponse {
    id: string; 
    pet_id: string; 
    event_date: string; 
    title?: string;
    description?: string;
    TimelineEntryPhotos: Array<{ id: string; photo_url: string; order: number | null }>;
}

export default function NewTimelineEntryForm({ petId, onSuccess }: NewTimelineEntryFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [eventDate, setEventDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Formato no válido. Solo JPEG/PNG.');
        e.target.value = ''; setSelectedFile(null); return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        toast.error('Máximo 5MB por foto.');
        e.target.value = ''; setSelectedFile(null); return;
      }
      setSelectedFile(file); setFormError(null);
    } else {
      setSelectedFile(null);
    }
  };

  
  const uploadPhotoToStorage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'timeline_photo');
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Error al procesar respuesta de subida de Storage."}));
        throw new Error(error.error || "Error al subir la imagen a Storage.");
      }
      const data: UploadApiResponse = await response.json();
      return data.url;
    } catch (error: any) {
      console.error("Error en uploadPhotoToStorage:", error);
      
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setFormError('Por favor, selecciona una foto.'); return;
    }
    if (!eventDate) {
      setFormError('Por favor, selecciona una fecha para el recuerdo.'); return;
    }
    

    setIsSubmitting(true); setFormError(null);

    try {
      
      const photoUrlFromServer = await uploadPhotoToStorage(selectedFile);

      if (!photoUrlFromServer) {
        
        setIsSubmitting(false);
        return;
      }

      console.log('Imagen subida con éxito a Supabase Storage. URL:', photoUrlFromServer);

      
      const timelineEntryDataToSave = {
        photoUrl: photoUrlFromServer,
        eventDate: eventDate,
        description: description,
        title: title, 
      };

      console.log("Enviando a API de BD:", `/api/timeline/${petId}/entries`, timelineEntryDataToSave);

      
      const dbResponse = await fetch(`/api/timeline/${petId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timelineEntryDataToSave),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json().catch(() => ({ error: "Error desconocido del servidor al guardar en BD." }));
        throw new Error(errorData.error || `Error al guardar la entrada del timeline en la BD (HTTP ${dbResponse.status})`);
      }

      const newEntryFromDB: TimelineEntryApiResponse = await dbResponse.json();
      console.log('Entrada guardada en BD y devuelta por la API:', newEntryFromDB);

      toast.success('¡Recuerdo añadido al timeline!');
      onSuccess(); 

      
      setSelectedFile(null);
      setEventDate('');
      setDescription('');
      setTitle(''); 
      const fileInput = document.getElementById('timeline-photo-upload-form-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error("Error en handleSubmit:", err);
      setFormError(err.message || 'Ocurrió un error al procesar el recuerdo.');
      toast.error(err.message || 'Ocurrió un error al procesar el recuerdo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && <p style={{ color: 'red', marginBottom: '10px' }}>{formError}</p>}
      {/* RF-005: Permitir añadir un título opcional */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="timeline-title-form-input">Título (opcional):</label>
        <Input
          type="text"
          id="timeline-title-form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="timeline-photo-upload-form-input">Foto (JPEG/PNG, máx 5MB):</label>
        <Input type="file" id="timeline-photo-upload-form-input" accept="image/jpeg, image/png" onChange={handleFileChange} disabled={isSubmitting} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="timeline-event-date-form-input">Fecha:</label>
        <Input type="date" id="timeline-event-date-form-input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="timeline-description-form-input">Descripción:</label>
        <textarea id="timeline-description-form-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={isSubmitting} style={{width: '100%', border:'1px solid #ccc', borderRadius:'4px', padding:'8px'}} />
      </div>
      <Button type="submit" disabled={isSubmitting || !selectedFile || !eventDate}>
        {isSubmitting ? 'Guardando...' : 'Añadir Recuerdo'}
      </Button>
    </form>
  );
}