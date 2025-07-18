"use client";

import { useState, useEffect, useMemo } from "react";
import type { Item } from "@/types/marketplace";

export function useMarketplace() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [petCats, setPetCats] = useState<string[]>([]);
  const [artCats, setArtCats] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/marketplace?mode=public")
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleFav = (id: string) => {
    setItems((prev) =>
      prev.map((it) => it.id === id ? { ...it, isFavorite: !it.isFavorite } : it)
    );
  };

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "all" && p.city !== city) return false;
      if (petCats.length && !petCats.includes(p.category)) return false;
      if (artCats.length && !artCats.includes(p.category)) return false;
      const price = Number(p.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (condition && p.condition !== condition) return false;
      return true;
    });
  }, [items, search, city, petCats, artCats, priceRange, condition]);

  const clearFilters = () => {
    setSearch(""); setCity("all"); setPetCats([]); setArtCats([]); setPriceRange([0,100000]); setCondition("");
  };

  return {
    items: filtered,
    loading,
    error,
    filters: { search, city, petCats, artCats, priceRange, condition },
    setters: { setSearch, setCity, setPetCats, setArtCats, setPriceRange, setCondition },
    toggleFav,
    clearFilters,
  };
}