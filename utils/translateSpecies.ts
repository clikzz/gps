export function translateSpecies(species: string): string {
  const speciesTranslations: Record<string, string> = {
    dog: "Perro",
    cat: "Gato",
    rabbit: "Conejo",
    hamster: "Hámster",
    turtle: "Tortuga",
    bird: "Pájaro",
    fish: "Pez",
    guineaPig: "Cobaya",
    ferret: "Hurón",
    mouse: "Ratón",
    chinchilla: "Chinchilla",
    hedgehog: "Erizo",
    snake: "Serpiente",
    frog: "Rana",
    lizard: "Lagarto",
    other: "Otro",
  };

  return speciesTranslations[species] || species;
}
