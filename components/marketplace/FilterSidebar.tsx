"use client";

import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface Props {
  filters: {
    search: string;
    city: string;
    petCats: string[];
    artCats: string[];
    priceRange: [number,number];
  };
  setters: {
    setSearch: (v:string)=>void;
    setCity: (v:string)=>void;
    setPetCats: (v:string[])=>void;
    setArtCats: (v:string[])=>void;
    setPriceRange: (v:[number,number])=>void;
  };
  clear: () => void;
}

export function FilterSidebar({ filters, setters, clear }: Props) {
  const { search, city, petCats, artCats, priceRange } = filters;
  const { setSearch, setCity, setPetCats, setArtCats, setPriceRange } = setters;
  const petCategories = ["Perros","Gatos","Aves","Reptiles","Roedores"];
  const articleCategories = ["Alimentos","Juguetes","Accesorios","Casas y Camas","Higiene","Transporte"];

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

      {/* Mascotas */}
      <div className="space-y-3">
        <Label>Tipo de mascota</Label>
        {petCategories.map((cat) => (
          <div key={cat} className="flex items-center space-x-2">
            <Checkbox
              checked={petCats.includes(cat)}
              onCheckedChange={(v: any) =>
                setPetCats(v ? [...petCats,cat] : petCats.filter(x=>x!==cat))
              }
            />
            <Label className="text-sm font-normal">{cat}</Label>
          </div>
        ))}
      </div>

      {/* Artículos */}
      <div className="space-y-3">
        <Label>Categoría</Label>
        {articleCategories.map((cat) => (
          <div key={cat} className="flex items-center space-x-2">
            <Checkbox
              checked={artCats.includes(cat)}
              onCheckedChange={(v: any) =>
                setArtCats(v ? [...artCats,cat] : artCats.filter(x=>x!==cat))
              }
            />
            <Label className="text-sm font-normal">{cat}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}