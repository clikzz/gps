"use client";

import { useState, useMemo } from "react";
import { Heart, Trash2, ShoppingBag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductCard } from "./ProductCard";
import { ProductDetailsDialog } from "@/components/marketplace/ProductDetails";
import type { Item } from "@/types/marketplace";

interface FavoritesSectionProps {
  favorites: Item[];
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
}

export function FavoritesSection({
  favorites,
  onToggleFavorite,
  onClearAll,
}: FavoritesSectionProps) {
  const [selected, setSelected] = useState<Item | null>(null);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [filterCat, setFilterCat] = useState<string>("all");

  const cats = Array.from(new Set(favorites.map((i) => i.pet_category)));

  const filtered = useMemo(() => {
    return favorites
      .filter((i) => filterCat === "all" || i.pet_category === filterCat)
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [favorites, sortBy, filterCat]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" /> Mis Favoritos
          </h2>
          <p className="text-muted-foreground">
            {favorites.length}{" "}
            {favorites.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="outline"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Limpiar todo
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No tienes favoritos aún
            </h3>
            <p className="text-muted-foreground mb-6">
              Guarda productos que te interesen haciendo clic en el corazón.
            </p>
            <Button onClick={() => setSelected(null)}>
              <ShoppingBag className="h-4 w-4 mr-2" /> Explorar productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filtros y orden */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Filtros y ordenamiento
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Select value={filterCat} onValueChange={setFilterCat}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por mascota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {cats.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Más recientes</SelectItem>
                      <SelectItem value="price-low">
                        Precio: menor a mayor
                      </SelectItem>
                      <SelectItem value="price-high">
                        Precio: mayor a menor
                      </SelectItem>
                      <SelectItem value="name">Nombre A–Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {filtered.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">
                  No hay favoritos con esos filtros.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => setFilterCat("all")}
                >
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  isFavorite={!!favorites.find((f) => f.id === item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                  onViewDetails={() => setSelected(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <ProductDetailsDialog
          item={selected}
          open={true}
          isFavorite={!!favorites.find((f) => f.id === selected.id)}
          onClose={() => setSelected(null)}
          onToggleFavorite={(id) => {
            onToggleFavorite(id)
            setSelected(null)
          }}
        />
      )}
    </div>
  );
}
