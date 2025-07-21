import { useState, useEffect } from "react";
import type { CreateItemInput } from "@/server/validations/marketplace.validation";

export function useRepostItem(itemId: number | null) {
  const [initialData, setInitialData] = useState<CreateItemInput | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemId == null) {
      setInitialData(undefined);
      return;
    }
    setLoading(true);
    fetch(`/api/marketplace?mode=item&id=${itemId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((item) => {
        setInitialData({
          title: item.title,
          description: item.description,
          category: item.category,
          pet_category: item.pet_category,
          condition: item.condition,
          price: Number(item.price),
          photo_urls: item.photo_urls,
          latitude: item.latitude,
          longitude: item.longitude,
          city: item.city,
          region: item.region,
          country: item.country,
        });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [itemId]);

  return { initialData, loading, error };
}