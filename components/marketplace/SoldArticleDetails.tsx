"use client"

import { useState } from "react"
import { Calendar, DollarSign, Copy, Check, TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel, getItemStatusLabel } from "@/types/translateLabels";
import { formatTimeAgo, formatTimeOnSale, getPriceColor } from "@/utils/format";
import type { UserArticle } from "@/types/marketplace"

interface SoldArticleDetailsProps {
  article: UserArticle | null
  onClose: () => void
  onRepost?: (articleId: number) => void
}

export function SoldArticleDetails({
  article,
  onClose,
  onRepost,
}: SoldArticleDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copiedId, setCopiedId] = useState(false)

  if (!article || article.status !== "SOLD") return null

  const petLabel = getPetCategoryLabel(article.pet_category)
  const categoryLabel = getItemCategoryLabel(article.category)
  const conditionLabel = getItemConditionLabel(article.condition)
  const itemStatusLabel = getItemStatusLabel(article.status)
  const priceClass = getPriceColor(article.price, article.sold_price, article.status === "SOLD")

  const originalPrice = article.price
  const soldPrice = article.sold_price ?? 0
  const profit = soldPrice - originalPrice
  const profitPercentage = ((profit / originalPrice) * 100).toFixed(1)
  const isProfit = profit >= 0

  const nextImage = () => {
    if (currentImageIndex < article.photo_urls.length - 1) {
      setCurrentImageIndex((i) => i + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((i) => i - 1)
    }
  }

  console.log("SoldArticleDetails article:", article)

  return (
    <Dialog open={!!article} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold pr-8">{article.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary">{itemStatusLabel}</Badge>
                <Badge variant="outline">{categoryLabel}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={article.photo_urls[currentImageIndex] || "/placeholder.svg"}
                alt={article.title}
                width={400}
                height={400}
                className="w-full h-80 object-cover rounded-lg opacity-90"
              />

              {article.photo_urls.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={nextImage}
                    disabled={currentImageIndex === article.photo_urls.length - 1}
                  >
                    →
                  </Button>
                </>
              )}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {article.photo_urls.length}
              </div>

              <div className="absolute top-2 left-2">
                <Badge className="bg-secondary">{petLabel}</Badge>
              </div>
            </div>

            {article.photo_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {article.photo_urls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      idx === currentImageIndex ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`${article.title} ${idx + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Información de venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Precio original</p>
                    <p className="text-xl font-semibold line-through text-muted-foreground">
                      ${originalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precio de venta</p>
                    <p className={`text-xl font-bold ${priceClass}`}>
                      ${soldPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isProfit ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-secondary" />
                    )}
                    <span className="font-medium">{isProfit ? "Ganancia" : "Pérdida"}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${priceClass}`}>
                      {isProfit ? "+" : ""}${profit.toLocaleString()}
                    </p>
                    <p className={`text-sm ${priceClass}`}>
                      ({isProfit ? "+" : ""}
                      {profitPercentage}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Cronología
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Publicado</span>
                  <span className="text-sm font-medium">{formatTimeAgo(article.created_at)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vendido</span>
                  <span className="text-sm font-medium">{article.sold_at ? formatTimeAgo(article.sold_at) : "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tiempo en venta</span>
                  <span className="text-sm font-medium">
                    {formatTimeOnSale(article.created_at, article.sold_at!)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Información del artículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Condición:</span>
                  <span className="text-sm font-medium">{conditionLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ciudad:</span>
                  <span className="text-sm font-medium">{article.city || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Región:</span>
                  <span className="text-sm font-medium">{article.region || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">País:</span>
                  <span className="text-sm font-medium">{article.country || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onRepost?.(article.id)}
              >
                Volver a publicar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
