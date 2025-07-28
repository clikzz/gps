"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, Filter, Heart, Store, DollarSign } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMarketplace } from "@/hooks/marketplace/useMarketplace";
import { useUserArticles } from "@/hooks/marketplace/useUserArticles";
import { useRepostItem } from "@/hooks/marketplace/useRepostItem";
import { useFavorites } from "@/hooks/marketplace/useFavorites";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import NewItemForm from "@/components/marketplace/NewItemForm";
import { MyArticles } from "@/components/marketplace/MyArticles";
import { MarkAsSoldModal }  from "@/components/marketplace/MarkAsSold";
import { EditArticleModal } from "@/components/marketplace/EditArticle";
import { FavoritesSection } from "@/components/marketplace/Favorites";
import LoadingScreen from "@/components/LoadingScreen";
import NoArticles from "@/components/marketplace/NoArticles";
import { UserArticle } from "@/types/marketplace";
import { Card, CardHeader } from "@/components/ui/card";

export default function MarketplacePage() {
  const [tab, setTab] = useState("para-ti");
  const [toSell, setToSell] = useState<UserArticle | null>(null);
  const [repostId, setRepostId] = useState<number | null>(null);
  const [editingArticle, setEditingArticle] = useState<UserArticle | null>(null)
  const { initialData, loading: loadingRepost } = useRepostItem(repostId);
  const { articles: userArticles, setArticles, loading: userLoading, error: userError, markAsSold, fetchArticles, removeArticle } = useUserArticles();
  const {
    items, loading, error,
    filters, setters, clearFilters,
  } = useMarketplace();
  const {
    favorites,
    loading: favLoading,
    error: favError,
    addFavorite, removeFavorite, clearFavorites,
    filters: favFilters,
    setters: favSetters,
    clearFilters: favClearFilters,
  } = useFavorites();

  const handleOpenMark = (id: number) => {
    const art = userArticles.find((a) => a.id === id);
    if (art) setToSell(art);
  };
  const handleCloseMark = () => setToSell(null);

  const handleConfirmMark = async (
    id: number,
    soldPrice: number,
    soldDate: string,
    notes?: string
  ) => {
    await markAsSold(id, soldPrice, soldDate, notes);
    handleCloseMark();
  };

  const handleRepost = (id: number) => {
    setRepostId(id);
    setTab("vender");
  };

  const handleEdit = (id: number) => {
    const art = userArticles.find(a => a.id === id)
    if (art) setEditingArticle(art)
  };

  const handleToggleFav = (id: string) => {
    favorites.some(f => f.id === id)
      ? removeFavorite(id)
      : addFavorite(id);
  };

  return (
    <div className="min-h-screen container mx-auto pb-20">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 lg:max-w-7xl md:max-w-5xl px-6">
        <header>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-2xl md:text-3xl">Marketplace</h1>
              </div>

              <Tabs value={tab} onValueChange={setTab} className="flex-1 max-w-md">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="para-ti">
                    <ShoppingBag className="mr-1 h-4 w-4"/> Para ti
                  </TabsTrigger>
                  <TabsTrigger value="favoritos">
                    <Heart className="mr-1 h-4 w-4"/> Favoritos
                  </TabsTrigger>
                  <TabsTrigger value="vender">
                    <DollarSign className="mr-1 h-4 w-4"/> Vender
                  </TabsTrigger>
                  <TabsTrigger value="mis-articulos">
                    <Package className="mr-1 h-4 w-4"/> Mis artículos
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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

                {loading && <LoadingScreen title="Cargando productos" subtext="Por favor, espera mientras cargamos los artículos." icon={Store} accentIcon={Store} />}
                {error && <p className="text-red-600">Error: {error}</p>}
                {items.length === 0 && <NoArticles title="No hay productos" subtext="No se encontraron artículos en esta categoría." icon={Store} accentIcon={Store} />}
                <MarketplaceGrid
                  items={items}
                  onToggleFavorite={handleToggleFav}
                  favorites={favorites}
                />
              </main>
            </div>
          </TabsContent>

          <TabsContent value="favoritos" className="mt-4">
            <div className="flex gap-6">
              {/* Sidebar desktop */}
              <aside className="hidden lg:block w-80 shrink-0">
                <Card className="sticky top-24">
                  <CardHeader>
                    <FilterSidebar
                      filters={favFilters}
                      setters={favSetters}
                      clear={favClearFilters}
                    />
                  </CardHeader>
                </Card>
              </aside>
              {/* Contenido principal */}
              <main className="flex-1">
                {/* Sidebar móvil */}
                <div className="lg:hidden mb-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2"/> Filtros
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

                {loading && <p>Cargando favoritos…</p>}
                {error   && <p className="text-red-600">{error}</p>}
                {!loading && !error && (
                  <FavoritesSection
                    favorites={favorites}
                    onToggleFavorite={handleToggleFav}
                    onClearAll={clearFavorites}
                  />
                )}
              </main>
            </div>
          </TabsContent>

          {/* — Vender — */}
          <TabsContent value="vender" className="mt-4">
            {loadingRepost ? (
              <LoadingScreen title="Obteniendo datos" subtext="Por favor, espera mientras rellenamos el formulario por ti." icon={Store} accentIcon={Store} />
            ) : (
              <NewItemForm
                onSuccess={() => {
                  fetchArticles();
                  setTab("mis-articulos");
                }}
                initialData={initialData}
              />
            )}
          </TabsContent>

          {/* “Mis artículos” */}
          <TabsContent value="mis-articulos" className="mt-4">
            {userLoading && <p>Cargando tus artículos…</p>}
            {userError && <p className="text-red-600">Error: {userError}</p>}
            {!userLoading && !userError && (
              <MyArticles
                articles={userArticles}
                onSwitchToSell={() => setTab("vender")}
                onMarkAsSold={handleOpenMark}
                onRepost={handleRepost}
                onEdit={handleEdit}
                onDelete={removeArticle}
              />
            )}
          </TabsContent>

          {/* Modal para marcar como vendido */}
          <MarkAsSoldModal
            article={toSell}
            onClose={handleCloseMark}
            onConfirm={handleConfirmMark}
          />

          {/* Modal para editar artículo */}
          <EditArticleModal
            article={editingArticle}
            onClose={() => setEditingArticle(null)}
            onSaved={(updated: UserArticle) => {
              setArticles(prev =>
                prev.map(a => (a.id === updated.id ? updated : a))
              );
              setEditingArticle(null);
            }}
          />
        </Tabs>
      </div>
    </div>
  );
}