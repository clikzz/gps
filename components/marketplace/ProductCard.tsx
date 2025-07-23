"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel } from "@/types/translateLabels";
import { MapPin, Heart, Clock } from "lucide-react";
import type { Item } from "@/types/marketplace";
import { formatTimeAgo, formatPrice } from "@/utils/format";

interface Props {
  item: Item;
  // onToggleFav: (id: string) => void;
  onViewDetails: () => void;
}

export function ProductCard({ item, onViewDetails }: Props) {
  const petLabel = getPetCategoryLabel(item.pet_category);
  const categoryLabel = getItemCategoryLabel(item.category);
  const conditionLabel = getItemConditionLabel(item.condition);

  console.log(`Rendering ProductCard for item: ${item.title}, price: ${item.price}, typeof price: ${typeof item.price}`);

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
          // onClick={() => onToggleFav(item.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge variant="secondary" className="absolute top-2 left-2">{petLabel}</Badge>
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
            <p className="text-2xl font-bold text-primary">${formatPrice(item.price)}</p>
            <p className="text-sm text-muted-foreground">por {item.seller.name}</p>
          </div>
          <Badge variant="outline">{categoryLabel}</Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(item.created_at).toLowerCase()}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={onViewDetails}>
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}