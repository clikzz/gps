"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Beef,
  Bone,
  BedDouble,
  PawPrint,
  HeartPulse,
  Plane,
  Box
} from "lucide-react";

export type CategoryValue =
  | "FOOD"
  | "TOYS"
  | "BEDDING"
  | "WALK_WEAR"
  | "HEALTH_GROOM"
  | "TRAVEL"
  | "OTHER";

export interface Category {
  label: string;
  value: CategoryValue;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { label: "Comida", value: "FOOD", icon: <Beef /> },
  { label: "Juguetes", value: "TOYS", icon: <Bone /> },
  { label: "Camas", value: "BEDDING", icon: <BedDouble /> },
  { label: "Paseo", value: "WALK_WEAR", icon: <PawPrint /> },
  { label: "Salud", value: "HEALTH_GROOM", icon: <HeartPulse /> },
  { label: "Viajes", value: "TRAVEL", icon: <Plane /> },
  { label: "Otros", value: "OTHER", icon: <Box /> },
];

interface Props {
  selected: CategoryValue[];
  onChange: (selected: CategoryValue[]) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (value: CategoryValue) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {categories.map(({ label, value, icon }) => {
        const isSel = selected.includes(value);
        return (
          <Button
            key={value}
            variant={isSel ? "secondary" : "outline"}
            size="icon"
            onClick={() => toggle(value)}
            className="flex flex-col items-center p-12 space-y-1 [&_svg]:h-6 [&_svg]:w-6"
          >
            {icon}
            <span className="text-sm">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}