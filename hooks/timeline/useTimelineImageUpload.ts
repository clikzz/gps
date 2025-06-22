import { useState } from 'react';
import { toast } from 'sonner';

export interface UseTimelineImageUploadResult {
    isUploading: boolean;
    uploadTimelinePhotos: (photos: FileList) => Promise<string[]>;
}

/**
 * Hook para gestionar la subida de fotos en el módulo Timeline.
 * Extrae la lógica de POST a /api/upload y manejo de errores.
 */
export const useTimelineImageUpload = (): UseTimelineImageUploadResult => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadTimelinePhotos = async (photos: FileList): Promise<string[]> => {
    setIsUploading(true);
    const urls: string[] = [];

    try {
        for (let i = 0; i < photos.length; i++) {
            const file = photos[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'timeline_photo');

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error || `Error al subir foto ${i + 1}`);
        }

        const { url } = await res.json();
        urls.push(url);
        }

    return urls;
    } catch (error: any) {
        console.error('[useTimelineImageUpload] Error:', error);
        const message = error instanceof Error
        ? error.message
        : 'Error al subir fotos del timeline.';
        toast.error(message);
        throw error;
    } finally {
        setIsUploading(false);
    }
    };

    return { isUploading, uploadTimelinePhotos };
};
