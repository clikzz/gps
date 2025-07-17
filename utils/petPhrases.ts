type SpeciesPhrases = {
  [key: string]: string[]
}

const cutePhrases: SpeciesPhrases = {
  dog: [
    "¡Siempre listo para jugar!",
    "Tu mejor amigo peludo.",
    "Un ladrido de alegría para ti.",
    "¡El mejor compañero de aventuras!",
    "Con una cola que no para de mover.",
  ],
  cat: [
    "Ronroneando de felicidad.",
    "Elegancia felina en su máxima expresión.",
    "Un maullido suave para tu corazón.",
    "Siempre buscando un rayo de sol.",
  ],
  bird: [
    "Cantando melodías para ti.",
    "Pequeño y lleno de energía.",
    "Un vuelo de alegría en tu hogar.",
    "Con plumas de mil colores.",
    "Siempre en las alturas.",
  ],
  fish: [
    "Nadando hacia la diversión.",
    "Un pequeño mundo acuático.",
    "Brillando bajo el agua.",
    "Silencioso pero lleno de vida.",
    "Explorando su arrecife personal.",
  ],
  default: [
    "Un compañero maravilloso.",
    "Siempre alegrando tus días.",
    "Con un corazón lleno de amor.",
    "Tu fiel amigo.",
  ],
}

export function getRandomPhraseBySpecies(species: string): string {
  const lowerCaseSpecies = species.toLowerCase()
  const phrases = cutePhrases[lowerCaseSpecies] || cutePhrases.default
  const randomIndex = Math.floor(Math.random() * phrases.length)
  return phrases[randomIndex]
}
