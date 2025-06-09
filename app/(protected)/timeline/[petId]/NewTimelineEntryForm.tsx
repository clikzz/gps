"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- INICIO: DEFINICIÓN LOCAL DEL COMPONENTE TEXTAREA (sin cambios) ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"
// --- FIN: DEFINICIÓN LOCAL DEL COMPONENTE TEXTAREA ---

// --- CAMBIO 1: VALIDACIÓN DE FECHA EN ZOD ---
const FormSchema = z.object({
  title: z.string().max(100, "El título es demasiado largo.").optional(),
  description: z.string().max(1000, "La descripción es demasiado larga.").optional(),
  eventDate: z.string()
    .refine((date) => date && date.trim() !== '', { message: "La fecha es requerida." })
    .refine((date) => {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Permite seleccionar el día actual completo
        return inputDate <= today;
    }, {
        message: "La fecha del evento no puede ser futura.",
    }),
  photos: z.custom<FileList>().optional(),
}).superRefine((data, ctx) => {
  const hasPhotos = data.photos && data.photos.length > 0;
  const hasDescription = data.description && data.description.trim() !== '';
  if (!hasPhotos && !hasDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes proporcionar una descripción si no incluyes fotos.',
      path: ['description'],
    });
  }
  if (data.photos && data.photos.length > 0) {
    if (data.photos![0].size > 5 * 1024 * 1024) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El tamaño máximo es 5MB.", path: ['photos'] });
    }
    if (!["image/jpeg", "image/png"].includes(data.photos![0].type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Solo se aceptan .jpg y .png.", path: ['photos'] });
    }
  }
});

type FormValues = z.infer<typeof FormSchema>;

interface NewTimelineEntryFormProps {
  petId: string;
  onSuccess: () => void;
}

export default function NewTimelineEntryForm({ petId, onSuccess }: NewTimelineEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- CAMBIO 2: OBTENER FECHA ACTUAL PARA EL FRONTEND ---
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    // --- CAMBIO 3: VALOR POR DEFECTO PARA LA FECHA ---
    defaultValues: { title: "", description: "", eventDate: today },
  });

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
        if (!uploadResponse.ok) throw new Error("Error al subir la imagen.");
        const uploadResult = await uploadResponse.json();
        uploadedUrls.push(uploadResult.url);
      }

      const entryPayload = {
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        photoUrls: uploadedUrls,
      };

      const entryResponse = await fetch(`/api/timeline/${petId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryPayload),
      });

      if (!entryResponse.ok) throw new Error("Error al crear la entrada en el timeline.");

      toast.success("¡Recuerdo añadido con éxito!");
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess();

    } catch (error: any) {
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
          )}
        />
        <FormField control={form.control} name="eventDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha del evento</FormLabel>
              {/* --- CAMBIO 4: ATRIBUTO 'max' EN EL INPUT --- */}
              <FormControl><Input type="date" {...field} max={today} /></FormControl>
              {/* --- CAMBIO 5: TEXTO DE AYUDA VISUAL --- */}
              <p className="text-xs text-muted-foreground pt-1">
                Selecciona una fecha actual o pasada.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl><Textarea placeholder="Describe este momento especial..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="photos" render={({ field }) => (
            <FormItem>
              <FormLabel>Foto (opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/jpeg, image/png"
                  ref={fileInputRef}
                  onChange={(e) => field.onChange(e.target.files && e.target.files.length > 0 ? e.target.files : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Guardar Recuerdo"}
        </Button>
      </form>
    </Form>
  );
}