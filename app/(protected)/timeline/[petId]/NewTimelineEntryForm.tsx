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
const ClientSpecificSchema = z.object({
  photos: z.custom<FileList>().optional(),
});

const CombinedClientSchema = z.intersection(NewTimelineEntrySchema, ClientSpecificSchema)
  .superRefine((data, ctx) => {
    type CombinedClientDataType = z.infer<typeof NewTimelineEntrySchema> & z.infer<typeof ClientSpecificSchema>;
    const clientData = data as CombinedClientDataType;

    const hasPhotos = clientData.photos && clientData.photos.length > 0;
    const hasDescription = clientData.description && clientData.description.trim() !== '';

    if (!hasPhotos && !hasDescription) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Debes proporcionar una descripción si no incluyes fotos o cargar al menos una foto.', path: ['description'] });
    }
    if (hasPhotos) {
      if (clientData.photos![0].size > 5 * 1024 * 1024) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El tamaño máximo es 5MB.", path: ['photos'] });
      }
      if (!["image/jpeg", "image/png"].includes(clientData.photos![0].type)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Solo se aceptan .jpg y .png.", path: ['photos'] });
      }
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

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    toast.info("Creando nueva entrada...");
    let uploadedUrls: string[] = [];

    try {
      if (data.photos && data.photos.length > 0) {
        const formData = new FormData();
        formData.append("file", data.photos[0]);
        formData.append("type", "timeline_photo");
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadResponse.ok) {
          const uploadErrorData = await uploadResponse.json();
          throw new Error(uploadErrorData.error || "Error al subir la imagen.");
        }
        const uploadResult = await uploadResponse.json();
        uploadedUrls.push(uploadResult.url);
      }

      const entryPayload = NewTimelineEntrySchema.parse({
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        photoUrls: uploadedUrls,
        milestoneIds: selected, // <-- enviamos los IDs de hitos seleccionados
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
      setSelected([]); // reset selección de hitos
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
            <FormLabel>Foto (opcional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/jpeg, image/png"
                ref={fileInputRef}
                onChange={e => field.onChange(e.target.files && e.target.files.length > 0 ? e.target.files : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Selección de hitos */}
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
