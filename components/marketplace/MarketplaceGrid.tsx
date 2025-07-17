"use client";

import React, { useEffect, useState } from "react";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import type { Item } from "@/types/marketplace";

interface CardItem {
  id: string;
  photo: string;
  title: string;
  price: string;
  city?: string;
}

export default function MarketplaceGrid() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError(null);

      const url = new URL("/api/marketplace", window.location.origin);
      url.searchParams.set("mode", "public");
      // Si quisieras filtrar por categoría, precio, etc:
      // url.searchParams.set("category", "FOOD");
      // url.searchParams.set("minPrice", "10");
      // …
      console.log("Fetching marketplace items from:", url.toString());

      try {
        const res = await fetch(url.toString(), { method: "GET" });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Error ${res.status}`);
        }

        const data = (await res.json()) as Item[];

        const cards: CardItem[] = data.map((it) => ({
          id: it.id,
          photo: it.photo_urls[0] ?? "/placeholder-1.jpg",
          title: it.title,
          price: `${it.price} CLP`,
          city: it.city,
        }));

        setItems(cards);
        console.log("Fetched items:", cards);
      } catch (e: any) {
        console.error("Error fetching marketplace items:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return <p>Cargando artículos…</p>;
  }
  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }
  if (items.length === 0) {
    return <p>No hay artículos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MarketplaceCard key={item.id} item={item} />
      ))}
    </div>
  );
}