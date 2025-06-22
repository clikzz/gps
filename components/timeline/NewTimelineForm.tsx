// /components/timeline/NewTimelineForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMilestones } from "@/hooks/timeline/useMilestones";
import { useTimelineImageUpload } from "@/hooks/timeline/useTimelineImageUpload";
import { useNewTimelineEntry } from "@/hooks/timeline/useNewTimelineEntry";
import {
  FormFieldWrapper,
  TextField,
  DateField,
  TextAreaField,
  FileField,
} from "@/components/timeline/NewTimelineFormField";

interface NewTimelineFormProps {
  petId: string;
  onSuccess?: () => void;
}

export default function NewTimelineForm({
  petId,
  onSuccess,
}: NewTimelineFormProps) {
  const today = new Date().toISOString().split("T")[0];

  // Hooks
  const { milestones } = useMilestones();
  const { isUploading, uploadTimelinePhotos } = useTimelineImageUpload();
  const { isSubmitting, createEntry } = useNewTimelineEntry(petId);

  // Estado local
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(today);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const toggleMilestone = (id: string) =>
    setSelectedMilestones(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );

  const handleFileChange = (files: FileList | null) => {
    if (!files) return setSelectedPhotos([]);
    setSelectedPhotos(Array.from(files).slice(0, 5));
  };

  const removePhoto = (idx: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const movePhoto = (idx: number, dir: "left" | "right") => {
    const arr = [...selectedPhotos];
    const target = dir === "left" ? idx - 1 : idx + 1;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setSelectedPhotos(arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && selectedPhotos.length === 0) {
      alert("Agrega una descripción o al menos una foto.");
      return;
    }

    // Subida de fotos
    const photoUrls = selectedPhotos.length
      ? await uploadTimelinePhotos(selectedPhotos as unknown as FileList)
      : [];

    // Crear entrada y revalidar
    await createEntry({
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      eventDate,
      photos: selectedPhotos as unknown as FileList,
      milestoneIds: selectedMilestones,
    });

    // Cerrar drawer / callback
    onSuccess?.();

    // Reset
    setTitle("");
    setDescription("");
    setEventDate(today);
    setSelectedMilestones([]);
    setSelectedPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Título (opcional)"
        value={title}
        onChange={setTitle}
        placeholder="Ej: Primer paseo"
      />

      <DateField
        label="Fecha del evento"
        value={eventDate}
        onChange={setEventDate}
        max={today}
      />

      <TextAreaField
        label="Descripción"
        value={description}
        onChange={setDescription}
        placeholder="Describe este momento..."
      />

      <FileField
        label="Fotos (máx. 5)"
        onChange={handleFileChange}
        multiple
      />
      {selectedPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {selectedPhotos.map((file, idx) => (
            <div key={idx} className="relative">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => movePhoto(idx, "left")}
                  className="absolute top-1 left-1 bg-white/70 rounded-full p-1"
                >
                  ‹
                </button>
              )}
              {idx < selectedPhotos.length - 1 && (
                <button
                  type="button"
                  onClick={() => movePhoto(idx, "right")}
                  className="absolute top-1 right-1 bg-white/70 rounded-full p-1"
                >
                  ›
                </button>
              )}
              <img
                src={URL.createObjectURL(file)}
                alt={`Foto ${idx + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <FormFieldWrapper label="Hitos (máx. 4)">
        <div className="flex flex-wrap gap-2 mt-1">
          {milestones.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMilestone(m.id)}
              className={cn(
                "px-3 py-1 border rounded",
                selectedMilestones.includes(m.id)
                  ? "bg-primary text-primary-foreground"
                  : ""
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
      </FormFieldWrapper>

      <Button
        type="submit"
        className="w-full mt-4"
        disabled={isSubmitting || isUploading}
      >
        {isUploading
          ? "Subiendo fotos..."
          : isSubmitting
          ? "Guardando..."
          : "Guardar Recuerdo"}
      </Button>
    </form>
  );
}
