"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Item } from "@/types/marketplace";
import { toast } from "sonner";

export function useFavorites() {
  const [rawFavs, setRawFavs] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"recent"|"price-low"|"price-high"|"name">("recent");

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace?mode=favorites");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setRawFavs((await res.json()) as Item[]);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (itemId: string) => {
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

  const removeFavorite = useCallback(async (itemId: string) => {
    try {
      const res = await fetch(`/api/marketplace?mode=favorite&id=${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success("Eliminado de favoritos");
      setRawFavs(prev => prev.filter(i => i.id !== itemId));
    } catch (e: any) {
      toast.error(e.message);
    }
  }, []);

  const clearFavorites = useCallback(async () => {
    try {
      const res = await fetch(`/api/marketplace?mode=favorites`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success("Favoritos limpiados");
      setRawFavs([]);
    } catch (e: any) {
      toast.error(e.message);
    }
  }, []);

  // — Filtros existentes —
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [petCats, setPetCats] = useState<string[]>([]);
  const [artCats, setArtCats] = useState<string[]>([]);
  const [condition, setCondition] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const favorites = useMemo(() => {
    return rawFavs
      .filter(p => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (city !== "all" && p.city !== city) return false;
        if (petCats.length && !petCats.includes(p.pet_category)) return false;
        if (artCats.length && !artCats.includes(p.category)) return false;
        const price = Number(p.price);
        if (price < priceRange[0] || price > priceRange[1]) return false;
        if (condition && p.condition !== condition) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":  return a.price - b.price;
          case "price-high": return b.price - a.price;
          case "name":       return a.title.localeCompare(b.title);
          case "recent":
          default:
            return 0;
        }
      });
  }, [rawFavs, search, city, petCats, artCats, priceRange, condition, sortBy]);

  const clearFilters = () => {
    setSearch(""); setCity("all"); setPetCats([]); setArtCats([]); setPriceRange([0,100000]); setCondition("");
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    clearFavorites,
    refetch: fetchFavorites,
    filters: { search, city, petCats, artCats, priceRange, condition, sortBy },
    setters: { setSearch, setCity, setPetCats, setArtCats, setPriceRange, setCondition, setSortBy },
    clearFilters,
  };
}