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

const badges = [
    {
      key: "WELCOME",
      name: "Bienvenida",
      description: "Por registrarte en la aplicación",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//welcome.png",
    },
    {
      key: "FIRST_PHOTO",
      name: "Primera foto",
      description: "Por subir la primera foto en el Timeline",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//first_photo.png",
    },
    {
      key: "PET_LOVER",
      name: "Pet Lover",
      description: "Por registrar más de un tipo de mascota",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//pet_lover.png",
    },
    {
      key: "MSG_10",
      name: "10 Mensajes",
      description: "Por publicar 10 mensajes en el foro",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//msg_10.png",
    },
    {
      key: "MSG_30",
      name: "30 Mensajes",
      description: "Por publicar 30 mensajes en el foro",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//msg_30.png",
    },
    {
      key: "DOG_LOVER",
      name: "Dog Lover",
      description: "Por registrar al menos una mascota de especie perro",
      icon_url:"https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//dog_lover.png",
    },
    {
      key: "CAT_LOVER",
      name: "Cat Lover",
      description: "Por registrar al menos una mascota de especie gato",
      icon_url:"https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//cat_lover.png",
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { key: b.key },
      update: {},
      create: b,
    });
  }
  console.log("seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
