'use client';

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Pet {
  id: string;
  name: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    pet_id: string;
    file: File | null;
    description: string;
  }) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loadingPets, setLoadingPets] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingPets(true);
    fetch('/api/find?mode=pets')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Pet[]) => setPets(data))
      .catch((err) => {
        console.error('Error al traer pets:', err);
        setPets([]);
      })
      .finally(() => setLoadingPets(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      alert('Debes seleccionar una mascota.');
      return;
    }
    onSubmit({ pet_id: selectedPetId, file, description });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Reportar Mascota Perdida</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Dropdown de mascotas */}
          <div>
            <label className="block font-medium mb-1">Selecciona tu mascota:</label>
            {loadingPets ? (
              <p>Cargando mascotas…</p>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'w-full flex justify-between items-center border border-gray-300 rounded px-3 py-2 text-left',
                      !selectedPetId ? 'text-gray-500' : 'text-black'
                    )}
                  >
                    {selectedPetId
                      ? pets.find((p) => p.id === selectedPetId)?.name
                      : '-- elige mascota --'}
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent sideOffset={4}>
                  {pets.map((p) => (
                    <DropdownMenuItem
                      key={p.id}
                      onSelect={() => setSelectedPetId(p.id)}
                    >
                      {p.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* 2. Input de foto */}
          <div>
            <label className="block font-medium mb-1">Foto de respaldo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          {/* 3. Descripción opcional */}
          <div>
            <label className="block font-medium mb-1">Descripción (opcional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Agregar detalles que ayuden a encontrarla"
            />
          </div>

          {/* Nota sobre ubicación */}
          <p className="text-sm text-gray-500">
            La ubicación se tomará del centro actual del mapa. Mueve el mapa para centrarlo sobre
            el punto donde viste por última vez a tu mascota.
          </p>

          {/* Botón Enviar */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Enviar Reporte
          </Button>
        </form>
      </div>
    </div>
  );
}