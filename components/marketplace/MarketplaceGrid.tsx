"use client"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { ProductDetailsDialog } from "@/components/marketplace/ProductDetails"
import type { Item } from "@/types/marketplace"
import { useState } from "react"

interface Props {
  items: Item[];
  favorites: Item[];
  onToggleFavorite: (id: string) => void;
}

export function MarketplaceGrid({ items, onToggleFavorite, favorites }: Props) {
  const [selected, setSelected] = useState<Item | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <ProductCard
            key={it.id}
            item={it}
            isFavorite={!!favorites.find((f) => f.id === it.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={() => setSelected(it)}
          />
        ))}
      </div>
      {selected && (
        <ProductDetailsDialog
          item={selected}
          open={!!selected}
          isFavorite={!!favorites.find((f) => f.id === selected.id)}
          onClose={() => setSelected(null)}
          onToggleFavorite={(id) => {
            onToggleFavorite(id);
          }}
        />
      )}
    </>
  );
}