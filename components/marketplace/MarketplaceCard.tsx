"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  item: { id: string; photo: string; title: string; price: string; };
}

export default function MarketplaceCard({ item }: Props) {
  return (
    <Link href={`/marketplace/${item.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader className="p-0">
          <img src={item.photo} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
        </CardHeader>
        <CardContent className="pt-4">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <p className="mt-2 font-semibold">{item.price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}