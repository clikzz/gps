import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pets as Pet } from "@prisma/client";

function PetCard({ pet }: { pet: Pet }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{pet.name}</CardTitle>
        <CardDescription>{pet.species}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue={pet.name} />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Input id="type" defaultValue={pet.species} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Guardar cambios</Button>
      </CardFooter>
    </Card>
  );
}

export default PetCard;
