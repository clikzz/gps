"use client";

import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PET_OPTIONS, CATEGORY_OPTIONS, CONDITION_OPTIONS } from "@/types/marketplace";
import { PetCategory } from "@prisma/client";
import { Search } from "lucide-react";

interface Props {
  filters: {
    search: string;
    city: string;
    petCats: string[];
    artCats: string[];
    condition: string;
    priceRange: [number,number];
  };
  setters: {
    setSearch: (v:string)=>void;
    setCity: (v:string)=>void;
    setPetCats: (v:string[])=>void;
    setArtCats: (v:string[])=>void;
    setCondition: (v:string)=>void;
    setPriceRange: (v:[number,number])=>void;
  };
  clear: () => void;
}

export function FilterSidebar({ filters, setters, clear }: Props) {
  const { search, city, petCats, artCats, priceRange, condition } = filters;
  const { setSearch, setCity, setPetCats, setArtCats, setPriceRange, setCondition } = setters;

  const onConditionChange = (value: string, checked: boolean) => {
    if (checked) {
      setCondition(value);
    } else {
      setCondition("");
    }
  };

  const onPetChange = (value: string, checked: boolean) => {
    if (value === PetCategory.ALL) {
      setPetCats(checked ? [PetCategory.ALL] : []);
      return;
    }
    let next = petCats.filter((v) => v !== PetCategory.ALL);
    if (checked) next = [...next, value];
    else next = next.filter((v) => v !== value);
    setPetCats(next);
  };

  const onArtChange = (value: string, checked: boolean) => {
    if (checked) {
      setArtCats([...artCats, value]);
    } else {
      setArtCats(artCats.filter((v) => v !== value));
    }
  };

  return (
    <div className="w-full space-y-6 p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={clear}>Limpiar</Button>
      </div>

      {/* Busca */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar productos</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="¿Qué buscas para tu mascota?"
            className="pl-10"
          />
        </div>
      </div>

      {/* Precio */}
      <div className="space-y-3">
        <Label>Rango de precio</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0} max={100000} step={1000}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Ciudad */}
      <div className="space-y-2">
        <Label>Ciudad</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue placeholder="Todas"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {["Concepción","Hualpén","San Pedro de la Paz","Chiguayante", "Los Ángeles"].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Artículos */}
      <div className="space-y-3">
        <Label>Categoría</Label>
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              checked={artCats.includes(value)}
              onCheckedChange={(checked: boolean) =>
                onArtChange(value, checked)
              }
            />
            <Label className="text-sm font-normal">{label}</Label>
          </div>
        ))}
      </div>

      {/* Condición */}
      <div className="space-y-3">
        <Label>Condición</Label>
        {CONDITION_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              checked={condition === value}
              onCheckedChange={(checked: boolean) =>
                onConditionChange(value, checked)
              }
            />
            <Label className="text-sm font-normal">{label}</Label>
          </div>
        ))}
      </div>

      {/* Mascotas */}
      <div className="space-y-3">
        <Label>Tipo de mascota</Label>
        {PET_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              checked={petCats.includes(value)}
              onCheckedChange={(checked: boolean) =>
                onPetChange(value, checked)
              }
            />
            <Label className="text-sm font-normal">{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}