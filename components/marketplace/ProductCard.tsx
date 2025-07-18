"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import type { Item } from "@/types/marketplace";

interface Props {
  item: Item;
  onToggleFav: (id: string) => void;
}

export function ProductCard({ item, onToggleFav }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={item.photo_urls[0] ?? "/placeholder.svg"}
          alt={item.title}
          width={300} height={200}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost" size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onToggleFav(item.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge variant="secondary" className="absolute top-2 left-2">{item.category}</Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{item.title}</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{item.city}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">${item.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">por {item.seller.name}</p>
          </div>
          <Badge variant="outline">{item.category}</Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Ver detalles</Button>
      </CardFooter>
    </Card>
  );
}