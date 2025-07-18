"use client";

import { ProductCard } from "@/components/marketplace/ProductCard";
import type { Item } from "@/types/marketplace";

interface Props {
  items: Item[];
  onToggleFav: (id: string) => void;
}

export function MarketplaceGrid({ items, onToggleFav }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <ProductCard key={it.id} item={it} onToggleFav={onToggleFav}/>
      ))}
    </div>
  );
}