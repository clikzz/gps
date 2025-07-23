"use client";

import { useState, useEffect, useCallback } from "react";
import type { Item } from "@/types/marketplace";
import { toast } from "sonner";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace?mode=favorites");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = (await res.json()) as Item[];
      setFavorites(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (itemId: bigint | number | string) => {
    try {
      const res = await fetch("/api/marketplace?mode=favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success("Añadido a favoritos");
      await fetchFavorites();
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [fetchFavorites]);

  const removeFavorite = useCallback(async (itemId: bigint | number | string) => {
    try {
      const res = await fetch(`/api/marketplace?mode=favorite&id=${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success("Eliminado de favoritos");
      setFavorites(prev => prev.filter(i => i.id !== itemId.toString()));
    } catch (e: any) {
      toast.error(e.message);
    }
  }, []);

  const clearFavorites = useCallback(async () => {
    try {
      const res = await fetch(`/api/marketplace?mode=favorites`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success("Favoritos limpiados");
      setFavorites([]);
    } catch (e: any) {
      toast.error(e.message);
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    clearFavorites,
    refetch: fetchFavorites,
  };
}