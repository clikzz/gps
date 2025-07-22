"use client"

import { useState, useEffect } from "react";
import type { EditableItem } from "@/types/marketplace";

export function useMarketplaceItem(id: string | null) {
  const [item, setItem] = useState<EditableItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/marketplace?mode=item&id=${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        const data = await r.json();
        setItem({
          id: data.id,
          status: data.status,
          title: data.title,
          description: data.description,
          category: data.category,
          pet_category: data.pet_category,
          condition: data.condition,
          price: Number(data.price),
          photo_urls: data.photo_urls,
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return { item, loading };
}