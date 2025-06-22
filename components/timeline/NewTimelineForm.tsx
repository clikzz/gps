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

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado local
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(today);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    photos?: string;
  }>({});

  // Límites
  const TITLE_MAX = 50;
  const DESC_MAX = 200;
  const PHOTOS_MAX = 5;

  // Handlers
  const toggleMilestone = (id: string) =>
    setSelectedMilestones((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );

  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      setSelectedPhotos([]);
      return;
    }
    const picked = Array.from(files).slice(0, PHOTOS_MAX);
    setSelectedPhotos(picked);
    // No borramos aquí errors.photos: mantendremos el error hasta el siguiente submit
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (idx: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const movePhoto = (idx: number, dir: "left" | "right") => {
    const arr = [...selectedPhotos];
    const target = dir === "left" ? idx - 1 : idx + 1;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setSelectedPhotos(arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores anteriores
    setErrors({});

    // 1) Validar título
    if (!title.trim()) {
      setErrors({ title: "El título es obligatorio." });
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 2) Validar descripción o fotos
    if (!description.trim() && selectedPhotos.length === 0) {
      setErrors({
        description: "Agrega una descripción o al menos una foto.",
      });
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 3) Subida de fotos
    const photoUrls = selectedPhotos.length
      ? await uploadTimelinePhotos(selectedPhotos as unknown as FileList)
      : [];

    // 4) Crear entrada y revalidar
    await createEntry({
      title: title.trim(),
      description: description.trim() || undefined,
      eventDate,
      photos: selectedPhotos as unknown as FileList,
      milestoneIds: selectedMilestones,
    });

    // 5) Callback y reset
    onSuccess?.();
    setTitle("");
    setDescription("");
    setEventDate(today);
    setSelectedMilestones([]);
    setSelectedPhotos([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* TÍTULO + CONTADOR */}
      <div className="relative">
        <TextField
          label="Título"
          value={title}
          onChange={(v) => {
            if (v.length <= TITLE_MAX) {
              setTitle(v);
            }
          }}
          placeholder="Ej: Primer paseo"
          required
          error={errors.title}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {title.length}/{TITLE_MAX}
        </p>
      </div>

      {/* FECHA */}
      <DateField
        label="Fecha del evento"
        value={eventDate}
        onChange={setEventDate}
        max={today}
      />

      {/* DESCRIPCIÓN + CONTADOR */}
      <div className="relative">
        <TextAreaField
          label="Descripción"
          value={description}
          onChange={(v) => {
            if (v.length <= DESC_MAX) setDescription(v);
          }}
          placeholder="Describe este momento..."
          error={errors.description}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {description.length}/{DESC_MAX}
        </p>
      </div>

      {/* FOTOS + CONTADOR */}
      <div className="relative">
        <FileField
          label="Fotos (máx. 5)"
          onChange={handleFileChange}
          multiple
          accept="image/jpeg, image/png"
          error={errors.photos}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {selectedPhotos.length}/{PHOTOS_MAX}
        </p>
      </div>

      {/* PREVIEW FOTOS */}
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

      {/* HITOS */}
      <FormFieldWrapper label="Hitos (máx. 4)">
        <div className="flex flex-wrap gap-2 mt-1">
          {milestones.map((m) => (
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

      {/* BOTÓN GUARDAR */}
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
