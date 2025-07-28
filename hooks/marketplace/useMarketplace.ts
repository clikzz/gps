"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high" | "name">("recent");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace?mode=public");
      const data = (await res.json()) as Item[];
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateLocalItem = useCallback((updated: Partial<Item> & { id: string }) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === updated.id ? { ...it, ...updated } : it
      )
    );
  }, []);

  const filteredAndSorted = useMemo(() => {
    const filtered = items.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "all" && p.city !== city) return false;
      if (petCats.length && !petCats.includes("ALL") && !petCats.includes(p.pet_category)) return false;
      if (artCats.length && !artCats.includes(p.category)) return false;
      const price = Number(p.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (condition && p.condition !== condition) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "recent":
        default:
          return 0;
      }
    });
  }, [items, search, city, petCats, artCats, priceRange, condition, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCity("all");
    setPetCats([]);
    setArtCats([]);
    setPriceRange([0, 10000000]);
    setCondition("");
    setSortBy("recent");
  };

  return {
    items: filteredAndSorted,
    loading,
    error,
    fetchItems,
    updateLocalItem,
    filters: { search, city, petCats, artCats, priceRange, condition, sortBy },
    setters: { setSearch, setCity, setPetCats, setArtCats, setPriceRange, setCondition, setSortBy },
    clearFilters,
  };
}