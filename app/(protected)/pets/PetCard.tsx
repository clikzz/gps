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
        {pet.photo_url && (
          <img
            src={pet.photo_url}
            alt={pet.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <CardContent>
          <Label htmlFor="pet-description">Alive</Label>
          <Input
            id="pet-alive"
            value={pet.active?.toString()}
            readOnly
            className="mt-2"
          />
          <Label htmlFor="pet-age">Adoption</Label>
          <Input
            id="pet-adoption"
            value={pet.date_of_adoption?.toString()}
            readOnly
            className="mt-2"
          />
          <Label htmlFor="pet-birth">Birth</Label>
          <Input
            id="pet-birth"
            value={pet.date_of_birth?.toString()}
            readOnly
            className="mt-2"
          />
          <Label htmlFor="pet-fixed">Fixed</Label>
          <Input
            id="pet-fixed"
            value={pet.fixed?.toString()}
            readOnly
            className="mt-2"
          />
          <Label htmlFor="sex">Sex</Label>
          <Input
            id="pet-sex"
            value={pet.sex?.toString()}
            readOnly
            className="mt-2"
          />
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default PetCard;
