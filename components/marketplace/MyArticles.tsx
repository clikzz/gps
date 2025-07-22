"use client";

import { useState } from "react";
import { Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserArticleCard } from "@/components/marketplace/UserArticleCard";
import type { UserArticle } from "@/types/marketplace";
import { SoldArticleDetails } from "@/components/marketplace/SoldArticleDetails";

interface Props {
  articles: UserArticle[];
  onSwitchToSell: () => void;
  onMarkAsSold?: (id: number) => void;
  onRepost?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function MyArticles({ articles, onSwitchToSell, onMarkAsSold, onRepost, onEdit }: Props) {
  const [activeTab, setActiveTab] = useState<"activos" | "vendidos">("activos");
  const [selectedArticle, setSelectedArticle] = useState<UserArticle | null>(null);

  const active = articles.filter((a) => a.status === "ACTIVE");
  const sold = articles.filter((a) => a.status === "SOLD");

  return (
    <div className="max-w-6xl mx-auto">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{active.length}</div>
            <p className="text-sm text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{sold.length}</div>
            <p className="text-sm text-muted-foreground">Vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{active.length + sold.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Sub-pestañas */}
      <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "activos" | "vendidos")} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="activos">Activos</TabsTrigger>
          <TabsTrigger value="vendidos">Vendidos</TabsTrigger>
        </TabsList>

        <TabsContent value="activos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((a) => (
              <UserArticleCard
                key={a.id}
                article={a}
                onEdit={onEdit}
                onMarkAsSold={onMarkAsSold}
              />
            ))}
          </div>
          {active.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
              <p className="text-muted-foreground mb-4">No tienes artículos activos</p>
              <Button onClick={onSwitchToSell}>Publicar uno</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vendidos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sold.map((a) => (
              <UserArticleCard
                key={a.id}
                article={a}
                onEdit={onEdit}
                onMarkAsSold={onMarkAsSold}
                onRepost={onRepost && (() => onRepost(a.id))}
                onViewDetails={(article) => setSelectedArticle(article)}
              />
            ))}
          </div>
          {sold.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-10 w-10 mx-auto text-muted-foreground mb-4"/>
              <p className="text-muted-foreground mb-4">Aún no has vendido nada</p>
              <Button onClick={() => setActiveTab("activos")}>Ver activos</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detalles del artículo vendido */}
      {selectedArticle && (
        <SoldArticleDetails
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onRepost={onRepost}
        />
      )}
    </div>
  );
}
