
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import prisma from "@/lib/db"
import { UserStatus } from ".prisma/client"
import { formatDateLabel } from "@/lib/date"

export default async function BannedPage() {
  const supa = await createClient()
  const {
    data: { session },
  } = await supa.auth.getSession()

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
      suspensionUntil: { lte: new Date() }
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

  const getEndDateText = () =>
    isSuspended ? `${endDate} a las ${endTime}` : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-medium">
            {isBanned
              ? "Has sido expulsado del foro permanentemente."
              : "Has sido expulsado del foro temporalmente."}
          </h1>

          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-medium">Razón:</span> {reason}
            </p>

            {isSuspended && (
              <p className="text-lg">
                <span className="font-medium">
                  Fecha de fin de la expulsión:
                </span>{" "}
                {getEndDateText()}
              </p>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-medium">Información sobre tu expulsión</h2>

          <div className="text-left space-y-3">
            {isBanned ? (
              <>
                <p>Tu cuenta ha sido baneada permanentemente del foro.</p>
                <p>
                  Esta decisión es definitiva y no podrás acceder al foro con
                  esta cuenta.
                </p>
                <p>
                  Si consideras que esta decisión es incorrecta, puedes
                  contactar con la administración.
                </p>
              </>
            ) : (
              <>
                <p>Tu cuenta ha sido suspendida temporalmente del foro.</p>
                <p>
                  Durante este período no podrás acceder al foro ni participar
                  en las discusiones.
                </p>
                <p>
                  Podrás volver a acceder al foro después de la fecha indicada.
                </p>
                <p>
                  Te recomendamos revisar las normas del foro para evitar
                  futuras sanciones.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/forum/rules">Leer las normas del foro</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/contact">Contactar administración</Link>
            </Button>
          </div>

          {isSuspended && (
            <p className="text-sm text-muted-foreground">
              Puedes intentar acceder nuevamente después del{" "}
              {getEndDateText()}
            </p>
          )}
        </div>

        <div className="pt-6">
          <Button variant="outline" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
