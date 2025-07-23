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
      description: "Por subir tu primera foto en el Timeline",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//first_photo.png",
    },
    {
      key: "PET_LOVER2",
      name: "PetLover",
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
      name: "DogLover",
      description: "Por registrar al menos una mascota de especie perro",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//dog_lover.png",
    },
    {
      key: "CAT_LOVER",
      name: "CatLover",
      description: "Por registrar al menos una mascota de especie gato",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//cat_lover.png",
    },
    {
      key: "ADMIN_ROLE",
      name: "Administrador",
      description: "Por formar parte del equipo de administración",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//admin.png",
    },
    {
      key: "MODERATOR_ROLE",
      name: "Moderador",
      description: "Por colaborar como moderador del foro",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//mod.png",
    },
    {
      key: "MARKETPLACE_PUBLISH",
      name: "Emprendedor",
      description: "Por publicar un artículo en el Marketplace",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//marketplace_publish.png",
    },
    {
      key: "MARKETPLACE_SALE",
      name: "Vendedor",
      description: "Por vender un artículo en el Marketplace",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//marketplace_sale.png",
    },
    {
      key: "FIRST_MEDICATION",
      name: "Primer Tratamiento",
      description: "Por registrar la primera medicación para una mascota",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//first_medication.png",
    },
    {
      key: "FIRST_VACCINE",
      name: "Primera Vacuna",
      description: "Por registrar la primera vacuna para una mascota",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//first_vaccine.png",
    },
    {
      key: "FIRST_REVIEW",
      name: "Primera Reseña",
      description: "Por dejar tu primera reseña de un servicio",
      icon_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/badges//first_review.png",
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
