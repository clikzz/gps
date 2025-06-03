
import React from "react";
import { Card } from "@/components/ui/card"; 
import NewTimelineEntryForm from "./NewTimelineEntryForm";

interface NewTimelineEntryCardProps {
  petId: string;
  onEntrySaved: () => void;
}

export default function NewTimelineEntryCard({ petId, onEntrySaved }: NewTimelineEntryCardProps) {
  return (
    <Card className="w-full p-4 mt-4 mb-6"> {/* Clases de ejemplo, ajusta según tu UI */}
      <h2 className="font-bold text-xl mb-3">Añadir Nuevo Recuerdo al Timeline</h2>
      <p className="text-sm text-gray-600 mb-4">
        Sube una foto, selecciona una fecha y añade una descripción para documentar un momento de tu mascota.
      </p>
      <NewTimelineEntryForm petId={petId} onSuccess={onEntrySaved} />
    </Card>
  );
}