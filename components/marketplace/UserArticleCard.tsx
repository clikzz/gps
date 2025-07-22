"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel } from "@/types/translateLabels";
import { MapPin, Clock } from "lucide-react";
import type { UserArticle } from "@/types/marketplace";
import { formatTimeAgo } from "@/utils/formatTime";

interface Props {
  article: UserArticle;
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMarkAsSold?: (id: number) => void;
  onRepost?: (id: number) => void;
  onViewDetails?: (article: UserArticle) => void;
}

export function UserArticleCard({
  article,
  onEdit,
  onToggleStatus,
  onDelete,
  onMarkAsSold,
  onRepost,
  onViewDetails,
}: Props) {
  const isSold = article.status === "SOLD";
  const isActive = article.status === "ACTIVE";

  const petLabel = getPetCategoryLabel(article.pet_category);
  const categoryLabel = getItemCategoryLabel(article.category);
  const conditionLabel = getItemConditionLabel(article.condition);

  console.log(`Rendering UserArticleCard for article: ${article.title}, article: ${JSON.stringify(article)}`);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={article.photo_urls[0] || "/placeholder.svg"}
          alt={article.title}
          width={300}
          height={200}
          className={`w-full h-48 object-cover ${isSold ? "opacity-60" : ""}`}
        />
        <Badge variant="secondary" className="absolute top-2 left-2">{petLabel}</Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{article.title}</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{article.city || "No existe"}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isSold ? (
          <div className="space-y-1">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precio original</p>
                <p className="line-through">
                  ${article.price != null ? article.price.toLocaleString() : "-"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Precio venta</p>
                <p className={`font-bold ${article.sold_price ? (article.sold_price >= article.price ? "text-primary" : "text-secondary") : "text-muted-foreground"}`}>
                  ${article.sold_price?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-primary">
              ${article.price?.toLocaleString()}
            </span>
            <Badge variant="outline" className="ml-2">
              {categoryLabel}
            </Badge>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{isSold ? article.sold_at ? `Vendido ${formatTimeAgo(article.sold_at).toLowerCase()}` : "" :formatTimeAgo(article.created_at).toLowerCase()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-center">
        {isSold ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(article)}
            >
              Ver detalles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRepost?.(article.id)}
            >
              Volver a publicar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(article.id)}
            >
              Editar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onMarkAsSold?.(article.id)}
            >
              Vendido
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(article.id)}
            >
              Eliminar
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
