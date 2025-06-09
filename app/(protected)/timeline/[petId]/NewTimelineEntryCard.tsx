"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewTimelineEntryForm from "./NewTimelineEntryForm";

interface NewTimelineEntryCardProps {
  petId: string;
  onEntrySaved: () => void;
}

export default function NewTimelineEntryCard({ petId, onEntrySaved }: NewTimelineEntryCardProps) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Añadir Nuevo Recuerdo</CardTitle>
        <CardDescription>
          Documenta un momento especial de tu mascota.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewTimelineEntryForm petId={petId} onSuccess={onEntrySaved} />
      </CardContent>
    </Card>
  );
}