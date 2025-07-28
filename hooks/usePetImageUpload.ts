import { useState, useCallback } from "react";
import { toast } from "sonner";
import { FILE_CONSTRAINTS, type ImageUploadResult } from "@/types/pet";

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const cropImageToSquare = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("No se pudo crear el contexto del canvas"));
          return;
        }

        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          size,
          size,
          0,
          0,
          size,
          size
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve(croppedFile);
          } else {
            reject(new Error("Error al procesar la imagen"));
          }
        }, file.type);
      };

      img.onerror = () => {
        reject(new Error("Error al cargar la imagen"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!validateFile(file)) return;

      try {
        const croppedFile = await cropImageToSquare(file);
        setSelectedFile(croppedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(croppedFile);
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        toast.error("Error al procesar la imagen");
      }
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
      formData.append("type", "pet");

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
      console.error("Error uploading image:", error);
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
  };
};
