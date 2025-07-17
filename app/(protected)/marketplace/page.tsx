import MarketplaceStats from "@/components/marketplace/MarketplaceStats";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import { NewItemDrawer } from "@/components/marketplace/NewItemDrawer";
import { Store } from "lucide-react";

export default async function MarketPage() {
  // const stats = {
  //   total: 0,
  //   active: 0,
  //   sold: 0,
  // };

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Store className="inline-block h-8 w-8" />
        Marketplace
      </h1>
      {/* <MarketStats stats={stats} /> */}
      <MarketplaceFilters />
      <div className="flex items-center justify-start">
        <NewItemDrawer />
      </div>
      <MarketplaceGrid />
    </main>
  );
}