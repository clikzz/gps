"use client";

import React from "react";
import CategoryFilter, { CategoryValue } from "./CategoryFilter";
import { Button } from "@/components/ui/button";

export default function MarketplaceFilters() {
  const [selectedCats, setSelectedCats] = React.useState<CategoryValue[]>([]);
  const [more, setMore] = React.useState(false);

  const handleFilter = () => {
    console.log("Filtro categorías:", selectedCats);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Categorías</h2>
          <p className="text-sm text-muted-foreground">
            Filtra por las categorías que te interesen. Puedes seleccionar varias.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setMore(!more)} variant="outline" size="sm">
            Más filtros
          </Button>
          <Button onClick={handleFilter} variant="default" size="sm">
            Aplicar
          </Button>
        </div>
      </div>

      <CategoryFilter
        selected={selectedCats}
        onChange={setSelectedCats}
      />

      {more && (
        <div className="flex gap-4">
          <input type="number" placeholder="Precio min" className="input" />
          <input type="number" placeholder="Precio max" className="input" />
        </div>
      )}
    </div>
  );
}