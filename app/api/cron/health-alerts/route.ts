import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Para Pages Router
export async function POST(request: Request) {
  // El mismo código pero adaptado para App Router
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Obtener la fecha actual (solo fecha, sin hora)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Buscar alertas para hoy que no han sido enviadas
    const alertsToSend = await prisma.healthAlerts.findMany({
      where: {
        alert_date: {
          gte: today,
          lt: tomorrow,
        },
        sent: false,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        Pets: {
          select: {
            id: true,
            name: true,
            species: true,
          },
        },
        Medications: {
          select: {
            id: true,
            name: true,
          },
        },
        Vaccinations: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(`Encontradas ${alertsToSend.length} alertas para enviar`);

    let sentCount = 0;
    let errorCount = 0;

    // Enviar cada alerta
    for (const alert of alertsToSend) {
      try {
        const emailContent = generateEmailContent(alert);

        if (!alert.users.email) {
          console.error(`Alerta ${alert.id} sin email asociado`);
          errorCount++;
          continue;
        }

        const { data, error } = await resend.emails.send({
          from: "Alertas de Salud <noreply@mn.alvaroloyola.works>",
          to: [alert.users.email],
          subject: alert.title,
          html: emailContent,
        });

        if (error) {
          console.error(`Error enviando email para alerta ${alert.id}:`, error);
          errorCount++;
          continue;
        }

        // Marcar como enviada
        await prisma.healthAlerts.update({
          where: { id: alert.id },
          data: { sent: true },
        });

        sentCount++;
        console.log(`Alerta ${alert.id} enviada exitosamente`);
      } catch (emailError) {
        console.error(`Error procesando alerta ${alert.id}:`, emailError);
        errorCount++;
      }
    }

    return Response.json(
      {
        message: "Proceso completado",
        totalAlerts: alertsToSend.length,
        sentCount,
        errorCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el cron job:", error);
    return Response.json(
      {
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Función para generar el contenido del email
function generateEmailContent(alert: any): string {
  const { users, Pets, Medications, Vaccinations } = alert;

  let specificInfo = "";

  if (alert.alert_type === "medication" && Medications) {
    specificInfo = `
      <p><strong>Medicamento:</strong> ${Medications.name}</p>
      <p><strong>Dosis:</strong> ${Medications.dosage}</p>
    `;
  } else if (alert.alert_type === "vaccination" && Vaccinations) {
    specificInfo = `
      <p><strong>Vacuna:</strong> ${Vaccinations.vaccine_name}</p>
      <p><strong>Veterinario:</strong> ${Vaccinations.veterinarian}</p>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${alert.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .pet-info { background-color: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .alert-info { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐾 Alerta de Salud</h1>
        </div>
        
        <div class="content">
          <h2>Hola ${users.first_name} ${users.last_name}!</h2>
          
          <div class="pet-info">
            <h3>Información de la Mascota</h3>
            <p><strong>Nombre:</strong> ${Pets.name}</p>
            <p><strong>Especie:</strong> ${Pets.species}</p>
          </div>
          
          <div class="alert-info">
            <h3>${alert.title}</h3>
            <p>${alert.message}</p>
            ${specificInfo}
            <p><strong>Fecha de la alerta:</strong> ${alert.alert_date.toLocaleDateString()}</p>
          </div>
          
          <p>No olvides cuidar la salud de tu mascota. Si tienes alguna pregunta, consulta con tu veterinario.</p>
          
          <hr>
          <p style="font-size: 12px; color: #666;">
            Este es un recordatorio automático. Si ya has completado esta tarea, puedes ignorar este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Para App Router (app/api/cron/health-alerts/route.ts)
/*
export async function POST(request: Request) {
  // El mismo código pero adaptado para App Router
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // ... resto del código igual pero retornando Response.json() en lugar de res.status()
}
*/
