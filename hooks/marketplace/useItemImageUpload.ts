import { useState, useCallback } from "react";
import { toast } from "sonner";
import { FILE_CONSTRAINTS, type ImageUploadResult } from "@/types/marketplace";

export const useImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const validateFile = (file: File): boolean => {
    if (!FILE_CONSTRAINTS.ACCEPTED_TYPES.includes(file.type as any)) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return false;
    }
    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      toast.error("La imagen debe ser menor a 5MB");
      return false;
    }
    return true;
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const valid = files.filter(validateFile);
    setSelectedFiles(valid);
    setPreviews(valid.map(f => URL.createObjectURL(f)));
  }, []);

  const uploadImages = useCallback(async (): Promise<ImageUploadResult> => {
    if (selectedFiles.length === 0) return { urls: [] };
    setIsUploading(true);
    try {
      const uploads = await Promise.all(selectedFiles.map(async file => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "marketplace");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al subir imagen");
        }
        const { url } = await res.json();
        return url as string;
      }));
      return { urls: uploads };
    } catch (e: any) {
      toast.error(e.message || "Error al subir imágenes");
      return { urls: [], error: e.message };
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles]);

  const resetImage = useCallback(() => {
    setSelectedFiles([]);
    setPreviews([]);
  }, []);

  return {
    selectedFiles,
    isUploading,
    previews,
    handleFileChange,
    uploadImages,
    resetImage,
  };
};
