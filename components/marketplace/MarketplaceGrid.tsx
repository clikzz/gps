"use client";

import React from "react";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";

const SAMPLE_CARDS = Array(9).fill(null).map((_, i) => ({
  id: String(i),
  photo: `/placeholder-${i % 3 + 1}.jpg`,
  title: `Artículo ${i + 1}`,
  price: `${(10 + i) * 5} USD`,
}));

export default function MarketplaceGrid() {
  const [items, setItems] = React.useState(SAMPLE_CARDS);

  React.useEffect(() => {
    // fetch
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MarketplaceCard key={item.id} item={item} />
      ))}
    </div>
  );
}