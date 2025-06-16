const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const defaults = [
    {
      name: "Cuidados y Salud",
      description: "Consejos sobre cuidados, salud y bienestar de nuestras mascotas.",
      category: "Cuidado de Mascotas",
    },
    {
      name: "Razas y Características",
      description: "Información sobre diferentes razas de mascotas y sus características.",
      category: "Cuidado de Mascotas",
    },
    {
      name: "Ayuda",
      description: "Espacio para solicitar ayuda con problemas específicos de tus mascotas.",
      category: "Cuidado de Mascotas",
    },
    {
      name: "Preguntas frecuentes",
      description: "Permite a los usuarios hacer preguntas y tener respuestas a través de mods.",
      category: "Asistencia / Informaciones",
    },
    {
      name: "Anuncios Técnicos",
      description: "Noticias y avisos sobre la plataforma.",
      category: "Asistencia / Informaciones",
    },
    {
      name: "Presentaciones",
      description: "Aquí los dueños se presentan con sus mascotas.",
      category: "Comunidad",
    },
    {
      name: "La cafetería",
      description: "Conversaciones sobre cualquier otro tema.",
      category: "Comunidad",
    },
  ];

  for (const sf of defaults) {
    await prisma.subforums.upsert({
      where: { name: sf.name },
      update: {},
      create: sf,
    });
  }

  console.log("✅ Subforums seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
