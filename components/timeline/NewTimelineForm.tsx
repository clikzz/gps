"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const SortablePhoto = React.memo(function SortablePhoto({
  id,
  file,
  index,
  onRemove,
}: {
  id: string;
  file: File;
  index: number;
  onRemove: (idx: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <img
        src={URL.createObjectURL(file)}
        alt={`Foto ${index + 1}`}
        className="w-full h-20 object-cover rounded border"
      />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        ×
      </button>
    </div>
  );
});

interface NewTimelineFormProps {
  petId: string;
  onSuccess?: () => void;
}

export default function NewTimelineForm({
  petId,
  onSuccess,
}: NewTimelineFormProps) {
  function getTodayLocalISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const today = getTodayLocalISO();


  const { milestones } = useMilestones();
  const { isUploading, uploadTimelinePhotos } = useTimelineImageUpload();
  const { isSubmitting, createEntry } = useNewTimelineEntry(petId);


  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


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


  const TITLE_MAX = 50;
  const DESC_MAX = 200;
  const PHOTOS_MAX = 5;


  const sensors = useSensors(useSensor(PointerSensor));

  const photoIds = useMemo(
    () => selectedPhotos.map((f) => `${f.name}-${f.lastModified}`),
    [selectedPhotos]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = photoIds.indexOf(active.id as string);
        const newIndex = photoIds.indexOf(over.id as string);
        setSelectedPhotos((photos) => arrayMove(photos, oldIndex, newIndex));
      }
    },
    [photoIds]
  );


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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = useCallback((idx: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  if (!title.trim()) {
    setErrors({ title: "El título es obligatorio." });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (!description.trim() && selectedPhotos.length === 0) {
    setErrors({ description: "Agrega una descripción o al menos una foto." });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Convertir eventDate local ("YYYY-MM-DD") a UTC "YYYY-MM-DDT00:00:00.000Z"
  const localDate = new Date(eventDate + "T00:00:00");
  const utcDateString = new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
  ).toISOString();

  const photoUrls = selectedPhotos.length
    ? await uploadTimelinePhotos(selectedPhotos as unknown as FileList)
    : [];

  await createEntry({
    title: title.trim(),
    description: description.trim() || undefined,
    eventDate: utcDateString,
    photos: selectedPhotos as unknown as FileList,
    milestoneIds: selectedMilestones,
  });

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
      <div className="relative">
        <TextField
          label="Título"
          value={title}
          onChange={(v) => {
            if (v.length <= TITLE_MAX) setTitle(v);
          }}
          placeholder="Ej: Primer paseo"
          error={errors.title}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {title.length}/{TITLE_MAX}
        </p>
      </div>

      <DateField
        label="Fecha del evento"
        value={eventDate}
        onChange={setEventDate}
        max={today}
      />

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

      {selectedPhotos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={photoIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {selectedPhotos.map((file, idx) => (
                <SortablePhoto
                  key={photoIds[idx]}
                  id={photoIds[idx]}
                  file={file}
                  index={idx}
                  onRemove={handleRemovePhoto}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

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
