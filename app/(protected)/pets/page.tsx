"use client";

import React from "react";
import { useUserProfile } from "@/stores/userProfile";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateAge } from "@/utils/calculateAge";
import { translateSpecies } from "@/utils/translateSpecies";

function Pets() {
  const pets = useUserProfile((state) => state?.user?.pets);
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Mis mascotas</h2>
      <div className="flex">
        {pets && pets.length > 0 ? (
          <div className="flex">
            <Table>
              <TableCaption>
                Lista de mascotas registradas. Puedes editar o eliminar cada
                una.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>{pet.name}</TableCell>
                    <TableCell>{translateSpecies(pet.species)}</TableCell>
                    <TableCell>
                      {pet.date_of_birth
                        ? calculateAge(pet.date_of_birth) + " años"
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-500 hover:underline">
                        Editar
                      </button>
                      <button className="text-red-500 hover:underline ml-2">
                        Eliminar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total de mascotas: {pets.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No tienes mascotas registradas.
          </p>
        )}
      </div>
    </div>
  );
}

export default Pets;
