import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextDosesTable } from "@/components/health/NextDosesTable";
import { VaccinationsTable } from "@/components/health/vaccinations/VaccinationsTable";
import { MedicationsTable } from "@/components/health/medications/MedicationsTable";

export function TabSelector() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="nextdoses">
        <TabsList>
          <TabsTrigger value="nextdoses">Próximas Dosis</TabsTrigger>
          <TabsTrigger value="vaccines">Vacunas</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="nextdoses">
          <NextDosesTable />
        </TabsContent>
        <TabsContent value="vaccines">
          <VaccinationsTable />
        </TabsContent>
        <TabsContent value="medications">
          <MedicationsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
