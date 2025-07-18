"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, Filter, Heart, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMarketplace } from "@/hooks/marketplace/useMarketplace";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import NewItemForm from "@/components/marketplace/NewItemForm";
import { Card, CardHeader } from "@/components/ui/card";

export default function MarketplacePage() {
  const [tab, setTab] = useState("para-ti");
  const {
    items, loading, error,
    filters, setters,
    toggleFav, clearFilters,
  } = useMarketplace();

  return (
    <div className="min-h-screen container mx-auto -mt-16">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 lg:max-w-7xl md:max-w-5xl px-6">
        <header>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-2xl md:text-3xl">Marketplace</h1>
              </div>

              <Tabs value={tab} onValueChange={setTab} className="flex-1 max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="para-ti">
                    <ShoppingBag className="mr-1 h-4 w-4"/> Para ti
                  </TabsTrigger>
                  <TabsTrigger value="vender">
                    <Package className="mr-1 h-4 w-4"/> Vender
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          {/* Para ti */}
          <TabsContent value="para-ti" className="mt-4">
            <div className="flex gap-6">
              <aside className="hidden lg:block w-80 shrink-0">
                <Card className="sticky top-24">
                  <CardHeader>
                    <FilterSidebar
                      filters={filters}
                      setters={setters}
                      clear={clearFilters}
                    />
                  </CardHeader>
                </Card>
              </aside>

              <main className="flex-1">
                {/* Filtros movil */}
                <div className="lg:hidden mb-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2"/> 
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar
                          filters={filters}
                          setters={setters}
                          clear={clearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {loading && <p>Cargando…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {!loading && !error && items.length === 0 && <p>No hay productos.</p>}

                <MarketplaceGrid items={items} onToggleFav={toggleFav}/>
              </main>
            </div>
          </TabsContent>

          {/* — Vender — */}
          <TabsContent value="vender" className="mt-4">
            <NewItemForm onSuccess={() => {}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}