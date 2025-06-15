import { useUserProfile } from "@/stores/userProfile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { translateSpecies } from "@/utils/translateSpecies";

function PetsStats() {
  const pets = useUserProfile((state) => state?.user?.pets);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const petTypes =
    pets?.reduce(
      (acc, pet) => {
        const species = translateSpecies(pet.species) || "Sin especificar";
        acc[species] = (acc[species] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};
  const mostCommonType = Object.entries(petTypes).sort(
    ([, a], [, b]) => b - a
  )[0];

  const totalPets = pets?.length || 0;

  return (
    <div>
      {isDesktop && (
        <motion.div
          className="col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {totalPets}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de mascotas
                </div>
              </div>

              {mostCommonType && (
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {mostCommonType[0]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tipo más común
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tipos de mascotas:</h4>
                {Object.entries(petTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm">{type}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {!isDesktop && (
        <motion.div
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalPets}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          {Object.entries(petTypes)
            .slice(0, 3)
            .map(([type, count]) => (
              <Card key={type}>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-semibold">{count}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {type}
                  </div>
                </CardContent>
              </Card>
            ))}
        </motion.div>
      )}
    </div>
  );
}

export default PetsStats;
