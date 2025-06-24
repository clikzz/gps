import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PROFILE_FILE_CONSTRAINTS, type ImageUploadResult } from "@/types/profile";

export const useProfileImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!PROFILE_FILE_CONSTRAINTS.ACCEPTED_TYPES.includes(file.type as any)) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return false;
    }
    if (file.size > PROFILE_FILE_CONSTRAINTS.MAX_SIZE) {
      toast.error("La imagen debe ser menor a 2MB");
      return false;
    }
    return true;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!validateFile(file)) return;
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const uploadImage = useCallback(async (): Promise<ImageUploadResult> => {
    if (!selectedFile) {
      return { url: null };
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "profile");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
      }
      const data = await response.json();
      return { url: data.url };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir la imagen";
      toast.error(errorMessage);
      return { url: null, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  const resetImage = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
  }, []);

  return {
    selectedFile,
    isUploading,
    imagePreview,
    handleFileChange,
    uploadImage,
    resetImage,
    setImagePreview,
  };
};
