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

// Importar el esquema de validación desde el archivo global
import { NewTimelineEntrySchema } from '@/server/validations/timelineValidation';

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

// --- INICIO: ESQUEMA DE VALIDACIÓN ZOD COMBINADO PARA EL CLIENTE ---

// 1. Define un esquema para los campos específicos del cliente (como 'photos')
const ClientSpecificSchema = z.object({
  photos: z.custom<FileList>().optional(),
});

// 2. Combina el esquema del servidor con el esquema específico del cliente
// Utilizamos z.intersection para combinar los esquemas, asegurando que ambos se apliquen.
// Esto nos da un ZodObject al que podemos aplicar nuestro superRefine local.
const CombinedClientSchema = z.intersection(NewTimelineEntrySchema, ClientSpecificSchema)
  .superRefine((data, ctx) => {
    // Los campos de NewTimelineEntrySchema ya están validados por NewTimelineEntrySchema.
    // Aquí solo necesitamos añadir las validaciones que involucran 'photos'
    // o validaciones cruzadas que el servidor no pueda o deba manejar.

    // Aseguramos el tipo de 'data' para evitar el error de 'any'
    type CombinedClientDataType = z.infer<typeof NewTimelineEntrySchema> & z.infer<typeof ClientSpecificSchema>;
    const clientData = data as CombinedClientDataType; 

    const hasPhotos = clientData.photos && clientData.photos.length > 0;
    const hasDescription = clientData.description && clientData.description.trim() !== '';

    // Re-aplicamos la validación cruzada para dar feedback temprano al usuario.
    // Esto es importante si el usuario borra la descripción después de cargar una foto, por ejemplo.
    if (!hasPhotos && !hasDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes proporcionar una descripción si no incluyes fotos o cargar al menos una foto.',
        path: ['description'],
      });
    }
    
    // Validaciones de foto (tamaño y tipo) que son exclusivas del cliente
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


// La inferencia del tipo ahora se hace del esquema combinado local
type FormValues = z.infer<typeof CombinedClientSchema>;

interface NewTimelineEntryFormProps {
  petId: string;
  onSuccess: () => void;
}

export default function NewTimelineEntryForm({ petId, onSuccess }: NewTimelineEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    // Usamos el esquema combinado para el resolver
    resolver: zodResolver(CombinedClientSchema),
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
        if (!uploadResponse.ok) {
          const uploadErrorData = await uploadResponse.json();
          throw new Error(uploadErrorData.error || "Error al subir la imagen.");
        }
        const uploadResult = await uploadResponse.json();
        uploadedUrls.push(uploadResult.url);
      }

      // Se construye el payload solo con los campos que el backend espera,
      // que son los validados por NewTimelineEntrySchema.
      // Aseguramos que 'data' cumple con el esquema del servidor para el payload.
      const entryPayload = NewTimelineEntrySchema.parse({
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        photoUrls: uploadedUrls,
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
          )}
        />
        <FormField control={form.control} name="eventDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha del evento</FormLabel>
              <FormControl><Input type="date" {...field} max={today} /></FormControl>
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