import Link from "next/link"
import { Mail, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"
import prisma from "@/lib/db"
import { UserStatus } from ".prisma/client"

export default async function ContactPage() {
  const supa = await createClient()
  const {
    data: { session },
  } = await supa.auth.getSession()

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-center">No estás autenticado.</p>
        <Link href="/login" className="underline mt-2">
          Iniciar sesión
        </Link>
      </div>
    )
  }

  await prisma.users.updateMany({
    where: {
      id: session.user.id,
      status: UserStatus.SUSPENDED,
      suspensionUntil: { lte: new Date() },
    },
    data: {
      status: UserStatus.ACTIVE,
      suspensionUntil: null,
      suspensionReason: null,
    },
  })

  const profile = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: {
      status: true,
      suspensionUntil: true,
      suspensionReason: true,
    },
  })

  if (!profile || profile.status === UserStatus.ACTIVE) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-center">No tienes sanciones activas.</p>
        <Link href="/forum" className="underline mt-2">
          Ir al foro
        </Link>
      </div>
    )
  }

  const isBanned = profile.status === UserStatus.BANNED
  const isSuspended = profile.status === UserStatus.SUSPENDED
  const reason = profile.suspensionReason ?? "No especificado"
  const endDate = profile.suspensionUntil
    ? profile.suspensionUntil.toLocaleDateString()
    : ""
  const endTime = profile.suspensionUntil
    ? profile.suspensionUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ""
  const suspensionText = isSuspended
    ? `suspendida temporalmente hasta el ${endDate} a las ${endTime}`
    : "baneada permanentemente"

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Centro de Soporte</h1>
          <p className="text-muted-foreground">Comunicación oficial del equipo de moderación</p>
        </div>

        <Card className="border">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  Notificación de {isBanned ? "Baneo" : "Suspensión"}
                </span>
              </div>
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Urgente</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            <div className="space-y-4 text-foreground">
              <p className="font-medium">Estimado/a usuario/a,</p>
              <p>
                Nos ponemos en contacto contigo para informarte que tu cuenta ha sido{" "}
                <strong>{suspensionText}</strong> de nuestro foro.
                <br />
                <span className="font-medium">Razón:</span> {reason}.
              </p>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-foreground">Infracciones posiblemente detectadas:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Spam repetitivo en múltiples hilos de discusión</li>
                  <li>Uso de lenguaje inapropiado hacia otros miembros</li>
                  <li>Publicación de contenido fuera de tema en secciones especializadas</li>
                </ul>
              </div>

              <p>
                Si consideras que esta decisión es incorrecta, puedes presentar una apelación
                siguiendo el proceso descrito más abajo.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">¿Cómo contactarnos?</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Email de Apelaciones</span>
                    </div>
                    <p className="text-sm text-muted-foreground">apelaciones@miapp.com</p>
                    <p className="text-xs text-muted-foreground">Respuesta en 3-5 días hábiles</p>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Soporte General</span>
                    </div>
                    <p className="text-sm text-muted-foreground">soporte@miapp.com</p>
                    <p className="text-xs text-muted-foreground">Para consultas generales</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Proceso de Apelación</h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Envía tu apelación</p>
                    <p className="text-sm text-muted-foreground">Incluye tu nombre de usuario y una explicación detallada</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Revisión del equipo</p>
                    <p className="text-sm text-muted-foreground">Nuestro equipo revisará tu caso en 3-5 días hábiles</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Decisión final</p>
                    <p className="text-sm text-muted-foreground">Recibirás una respuesta con la decisión final</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Link href="/forumrules">Leer las normas del foro</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
