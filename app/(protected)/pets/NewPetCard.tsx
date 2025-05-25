import React from "react";
import { Card } from "@/components/ui/card";
import NewPetForm from "./NewPetForm";

function NewPetCard() {
  return (
    <Card className="w-full h-full p-4">
      <h2 className="font-bold text-2xl mb-4">Registrar nueva mascota</h2>
      <p className="text-sm text-gray-600 mb-4">
        Completa el formulario para registrar una nueva mascota en tu perfil.
      </p>
      <NewPetForm />
    </Card>
  );
}

export default NewPetCard;
