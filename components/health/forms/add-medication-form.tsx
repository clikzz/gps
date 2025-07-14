"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicationSchema } from "@/server/validations/medication.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";
import { useActivePet } from "@/stores/activePet";
import { useHealth } from "@/stores/health";
import { useState } from "react";
import type { z } from "zod";

type MedicationFormData = z.infer<typeof medicationSchema>;

interface AddMedicationFormProps {
  onSuccess?: () => void;
  initialData?: Partial<MedicationFormData>;
  isEditing?: boolean;
}

export function AddMedicationForm({
  onSuccess,
  initialData,
  isEditing = false,
}: AddMedicationFormProps) {
  const activePet = useActivePet((state) => state.activePet);
  const { addMedication, updateMedication } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: initialData?.name || "",
      dose: initialData?.dose || "",
      duration: initialData?.duration || "",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : new Date(),
      next_dose_date: initialData?.next_dose_date
        ? new Date(initialData.next_dose_date)
        : undefined,
      notes: initialData?.notes || "",
      active: initialData?.active ?? true,
    },
  });

  const onSubmit = async (data: MedicationFormData) => {
    if (!activePet?.id) {
      console.error("No active pet selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const medicationData = {
        ...data,
        pet_id: activePet.id.toString(),
        id: initialData?.id,
      };

      if (isEditing && initialData?.id) {
        await updateMedication(medicationData);
      } else {
        await addMedication(medicationData);
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving medication:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Medicamento *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Ej: Antibiótico, Antiinflamatorio..."
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dose">Dosis *</Label>
        <Input
          id="dose"
          {...register("dose")}
          placeholder="Ej: 1 tableta, 5ml, 2 gotas..."
        />
        {errors.dose && (
          <p className="text-sm text-destructive">{errors.dose.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duración *</Label>
        <Input
          id="duration"
          {...register("duration")}
          placeholder="Ej: 7 días, 2 semanas, cada 8 horas..."
        />
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Fecha de Inicio *</Label>
        <Controller
          control={control}
          name="start_date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Seleccionar fecha"
            />
          )}
        />
        {errors.start_date && (
          <p className="text-sm text-destructive">
            {errors.start_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Próxima Dosis</Label>
        <Controller
          control={control}
          name="next_dose_date"
          render={({ field }) => (
            <DatePicker
              value={field.value ?? undefined}
              onChange={field.onChange}
              placeholder="Seleccionar fecha (opcional)"
            />
          )}
        />
        {errors.next_dose_date && (
          <p className="text-sm text-destructive">
            {errors.next_dose_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Notas adicionales sobre el medicamento..."
          rows={3}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Actualizar Medicamento" : "Agregar Medicamento"}
      </Button>
    </form>
  );
}
