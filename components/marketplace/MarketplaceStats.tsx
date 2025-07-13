"use client";
import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  stats: { total: number; active: number; sold: number; };
}

export default function MarketplaceStats({ stats }: Props) {
  return (
    <div className="flex">
      {[
        { label: "Publicados", value: stats.total },
        { label: "Activos", value: stats.active },
        { label: "Vendidos", value: stats.sold },
      ].map(({ label, value }) => (
        <Card key={label} className="flex-1 text-center p-4 flex flex-col justify-center border-0 shadow-none">
          <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
            <CardTitle>{value}</CardTitle>
            <CardDescription>{label}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}