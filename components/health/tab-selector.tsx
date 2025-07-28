import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextDosesTable } from "@/components/health/next-doses-table";
import { VaccinationsTable } from "@/components/health/vaccinations/vaccinations-table";
import { MedicationsTable } from "@/components/health/medications/medications-table";
import { HealthTimeline } from "@/components/health/timeline/health-timeline";
import { HealthCalendar } from "@/components/health/calendar/health-calendar";

interface TabSelectorProps {
  onTabChange?: (value: string) => void;
}

export function TabSelector({ onTabChange }: TabSelectorProps) {
  return (
    <div className="w-full">
      <Tabs
        defaultValue="nextdoses"
        className="w-full"
        onValueChange={onTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 h-auto p-1">
          <TabsTrigger value="nextdoses" className="text-xs sm:text-sm">
            Próximas
          </TabsTrigger>
          <TabsTrigger value="vaccines" className="text-xs sm:text-sm">
            Vacunas
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-xs sm:text-sm">
            Medicamentos
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs sm:text-sm">
            Historial
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">
            Calendario
          </TabsTrigger>
        </TabsList>
        <TabsContent value="nextdoses" className="mt-6">
          <NextDosesTable />
        </TabsContent>
        <TabsContent value="vaccines" className="mt-6">
          <VaccinationsTable />
        </TabsContent>
        <TabsContent value="medications" className="mt-6">
          <MedicationsTable />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <HealthTimeline />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <HealthCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
