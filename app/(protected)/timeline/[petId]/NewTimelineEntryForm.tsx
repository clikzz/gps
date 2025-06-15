"use client";

import React, { useEffect, useState, useRef, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Importar el esquema de validación desde el archivo global
import { NewTimelineEntrySchema } from '@/server/validations/timeline.validation';

// --- INICIO: DEFINICIÓN LOCAL DEL COMPONENTE TEXTAREA (sin cambios) ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
// --- FIN: DEFINICIÓN LOCAL DEL COMPONENTE TEXTAREA ---

// --- INICIO: ESQUEMA DE VALIDACIÓN ZOD COMBINADO PARA EL CLIENTE ---
// Antes: z.intersection(NewTimelineEntrySchema, ClientSpecificSchema)
// Ahora: sólo validamos fotos en cliente

// --- INICIO: ESQUEMA DE VALIDACIÓN ZOD COMBINADO PARA EL CLIENTE ---
const ClientSpecificSchema = z.object({
  photos: z.custom<FileList>().optional(),
});

// Extraer el objeto base del esquema global (es un ZodEffects, por eso accedemos a _def.schema)
const baseSchema = (NewTimelineEntrySchema as any)._def.schema as z.ZodObject<any>;

const CombinedClientSchema = z.object({
  title: baseSchema.shape.title,
  description: baseSchema.shape.description,
  eventDate: baseSchema.shape.eventDate,
  photos: z.custom<FileList>().optional(),
}).superRefine((data, ctx) => {
  // Validaciones de fotos en cliente (cuenta, tamaño, tipo)
  if (data.photos && data.photos.length > 0) {
    if (data.photos.length > 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Máximo 5 fotos permitidas.", path: ['photos'] });
    }
    Array.from(data.photos).forEach((file, i) => {
      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Foto ${i + 1}: El tamaño máximo es 5MB.`, path: ['photos'] });
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Foto ${i + 1}: Solo se aceptan .jpg y .png.`, path: ['photos'] });
      }
    });
  }
});
// --- FIN: ESQUEMA DE VALIDACIÓN ZOD COMBINADO PARA EL CLIENTE ---

type FormValues = z.infer<typeof CombinedClientSchema>;

interface NewTimelineEntryFormProps {
  petId: string;
  onSuccess: () => void;
}

interface Milestone { id: string; name: string; icon_url?: string; }

export default function NewTimelineEntryForm({ petId, onSuccess }: NewTimelineEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(CombinedClientSchema),
    defaultValues: { title: "", description: "", eventDate: today },
  });

  useEffect(() => {
    fetch('/api/milestones')
      .then(res => res.json())
      .then(setMilestones)
      .catch(console.error);
  }, []);

  function toggleMilestone(id: string) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  }

  // Función para manejar la selección de archivos
  function handleFileSelection(files: FileList | null) {
    if (!files) {
      setSelectedPhotos([]);
      form.setValue('photos', undefined);
      return;
    }

    const fileArray = Array.from(files).slice(0, 5); // Máximo 5 fotos
    setSelectedPhotos(fileArray);
    
    // Crear un FileList fake para el formulario
    const dt = new DataTransfer();
    fileArray.forEach(file => dt.items.add(file));
    form.setValue('photos', dt.files);
  }

  // Función para eliminar una foto específica
  function removePhoto(indexToRemove: number) {
    const newPhotos = selectedPhotos.filter((_, index) => index !== indexToRemove);
    setSelectedPhotos(newPhotos);
    
    if (newPhotos.length === 0) {
      form.setValue('photos', undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      const dt = new DataTransfer();
      newPhotos.forEach(file => dt.items.add(file));
      form.setValue('photos', dt.files);
    }
  }

  // Validación personalizada antes del envío (foto o descripción)
  function validateFormData(data: FormValues): string | null {
    const hasPhotos = selectedPhotos.length > 0;
    const hasDescription = data.description && data.description.trim() !== '';

    if (!hasPhotos && !hasDescription) {
      return 'Debes proporcionar una descripción si no incluyes fotos o cargar al menos una foto.';
    }

    return null;
  }

  async function onSubmit(data: FormValues) {
    // Validación inmediata en cliente
    const validationError = validateFormData(data);
    if (validationError) {
      toast.error(validationError);
      form.setError('description', { message: validationError });
      return;
    }

    setIsSubmitting(true);
    toast.info("Creando nueva entrada...");
    let uploadedUrls: string[] = [];

    try {
      // Subir fotos si las hay
      if (selectedPhotos.length > 0) {
        for (let i = 0; i < selectedPhotos.length; i++) {
          const formData = new FormData();
          formData.append("file", selectedPhotos[i]);
          formData.append("type", "timeline_photo");

          const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
          if (!uploadResponse.ok) {
            const uploadErrorData = await uploadResponse.json();
            throw new Error(`Error al subir la foto ${i + 1}: ${uploadErrorData.error || "Error desconocido"}`);
          }

          const uploadResult = await uploadResponse.json();
          uploadedUrls.push(uploadResult.url);
        }
      }

      // ✅ Doble validación: re-evaluar fotoUrls o descripción en backend
      const entryPayload = NewTimelineEntrySchema.parse({
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        photoUrls: uploadedUrls,
        milestoneIds: selected,
      });

      const entryResponse = await fetch(`/api/timeline/${petId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryPayload),
      });

      if (!entryResponse.ok) {
        const errorData = await entryResponse.json();
        throw new Error(errorData.error || "Error al crear la entrada en el timeline.");
      }

      toast.success("¡Recuerdo añadido con éxito!");
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelected([]);
      setSelectedPhotos([]);
      onSuccess();
    } catch (error: any) {
      console.error("[NewTimelineEntryForm] Error al enviar el formulario:", error);
      toast.error(error.message || "No se pudo crear la entrada.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ——— Mantén tus campos tal cual los tenías ——— */}
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Título (opcional)</FormLabel>
            <FormControl><Input placeholder="Ej: Primer día en la playa" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="eventDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha del evento</FormLabel>
            <FormControl><Input type="date" {...field} max={today} /></FormControl>
            <p className="text-xs text-muted-foreground pt-1">
              Selecciona una fecha actual o pasada.
            </p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl><Textarea placeholder="Describe este momento especial..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="photos" render={({ field }) => (
          <FormItem>
            <FormLabel>Fotos (opcional - máx. 5)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/jpeg, image/png"
                multiple
                ref={fileInputRef}
                onChange={e => handleFileSelection(e.target.files)}
              />
            </FormControl>

            {selectedPhotos.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">
                  Fotos seleccionadas ({selectedPhotos.length}/5):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedPhotos.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                      <p className="text-xs text-center mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Puedes seleccionar hasta 5 fotos a la vez. Formatos: JPG, PNG. Máximo 5MB por foto.
            </p>
            <FormMessage />
          </FormItem>
        )} />

        {/* Selección de hitos (sin cambios) */}
        <div>
          <FormLabel>Hitos (máx. 4)</FormLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {milestones.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMilestone(m.id)}
                className={cn(
                  "px-3 py-1 border rounded",
                  selected.includes(m.id) && "bg-primary text-primary-foreground"
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Guardar Recuerdo"}
        </Button>
      </form>
    </Form>
  );
}
