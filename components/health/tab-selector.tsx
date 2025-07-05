import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextDosesTable } from "@/components/health/next-doses-table";
import { VaccinationsTable } from "@/components/health/vaccinations/vaccinations-table";
import { MedicationsTable } from "@/components/health/medications/medications-table";
import { HealthTimeline } from "@/components/health/timeline/health-timeline";
import { HealthCalendar } from "@/components/health/calendar/health-calendar";

export function TabSelector() {
  return (
    <div className="w-full">
      <Tabs defaultValue="nextdoses" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nextdoses">Próximas</TabsTrigger>
          <TabsTrigger value="vaccines">Vacunas</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
          <TabsTrigger value="timeline">Historial</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
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
