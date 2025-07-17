"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  item: { 
    id: string; 
    photo: string; 
    title: string; 
    price: string; 
    city?: string;
  };
}

export default function MarketplaceCard({ item }: Props) {
  return (
    <Link href={`/marketplace/${item.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader className="p-0">
          <img src={item.photo} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
        </CardHeader>
        <CardContent className="pt-4 flex flex-row justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <p className="mt-2 font-semibold">{item.price}</p>
          <p className="text-sm text-muted-foreground">{item.city}</p>
        </CardContent>
      </Card>
    </Link>
  );
}