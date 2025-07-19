"use client"

import { formatDateLabel } from "@/lib/date"
import { Shield, AlertTriangle, Users, Gavel, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForumRules() {
  const rulesAuthor = {
    name: "Administración",
    id: "system",
    tag: 999,
    menssageCount: 1,
    avatar_url: "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/images/profile/defaultpfp.png",
    role: "ADMIN",
  }

  const createdAt = "2025-07-17T12:00:00Z" 

  return (
    <div className="border rounded-lg overflow-hidden relative">
      <div className="border-b p-3 flex justify-end items-center text-sm">
        <div className="flex items-center gap-4">
          <span>{formatDateLabel(createdAt)}</span>
          <span>#REGLAS</span>
        </div>
      </div>

      <div className="flex">
        <div className="w-48 border-r p-4 text-center space-y-3">
          <div>
            <span className="font-medium text-sm">
              <span className="text-accent">{rulesAuthor.name}</span>
              <span className="text-gray-400"> #{rulesAuthor.tag}</span>
            </span>
          </div>
          <div className="text-xs font-semibold text-destructive">Administrador</div>
          <div className="flex justify-center">
            <img
              src={rulesAuthor.avatar_url || "/placeholder.svg"}
              alt={`Avatar de ${rulesAuthor.name}`}
              className="w-24 h-24 rounded border"
            />
          </div>
          <div className="text-xs">Mensajes: {rulesAuthor.menssageCount.toLocaleString()}</div>
        </div>

        <div className="flex-1 p-4 min-h-[200px] space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-8 w-8 text-muted-foreground" />
              <h1 className="text-3xl font-bold text-foreground">Reglas del Foro de Mascotas</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estas reglas están diseñadas para mantener un ambiente seguro, respetuoso y útil para todos los amantes de
              las mascotas en nuestra comunidad.
            </p>
          </div>

          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-foreground">
              <strong>Importante:</strong> Este foro está dedicado al bienestar animal. Cualquier contenido que promueva
              maltrato, negligencia o actividades ilegales relacionadas con animales resultará en baneo inmediato.
            </AlertDescription>
          </Alert>

          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Reglas Generales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>Bienestar animal primero</span>
                  </h3>
                  <p className="text-muted-foreground text-sm ml-8">
                    Todas las recomendaciones y consejos deben priorizar la salud y bienestar de las mascotas. No se
                    toleran sugerencias que puedan dañar a los animales.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Respeto entre miembros</span>
                  </h3>
                  <p className="text-muted-foreground text-sm ml-8">
                    Trata a todos con respeto, especialmente a los nuevos dueños de mascotas. Todos estamos aquí para
                    aprender y ayudar. No juzgues las decisiones de otros sin conocer el contexto completo.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Consulta veterinaria obligatoria</span>
                  </h3>
                  <p className="text-muted-foreground text-sm ml-8">
                    Para problemas de salud serios, siempre recomienda consultar a un veterinario. Los consejos del foro
                    no sustituyen la atención médica profesional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Normas Específicas por Sección</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-foreground mb-3">🏠 Cuidado de Mascotas</h3>

                  <div className="grid md:grid-cols-1 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">🏥 Cuidados y Salud</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Consejos sobre cuidados, salud y bienestar de nuestras mascotas.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Incluye síntomas específicos y duración</li>
                        <li>• Menciona edad, raza y peso de la mascota</li>
                        <li>• Para emergencias, busca atención veterinaria inmediata</li>
                        <li>• Comparte experiencias con tratamientos exitosos</li>
                        <li>• Siempre recomienda consulta profesional para casos serios</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">🐕 Razas y Características</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Información sobre diferentes razas de mascotas y sus características.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Proporciona información precisa y verificada</li>
                        <li>• Incluye temperamento, necesidades de ejercicio y cuidados</li>
                        <li>• Menciona posibles problemas de salud hereditarios</li>
                        <li>• Comparte experiencias personales con razas específicas</li>
                        <li>• Evita estereotipos negativos sobre razas</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">🆘 Ayuda</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Espacio para solicitar ayuda con problemas específicos de tus mascotas.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Describe el problema de manera detallada</li>
                        <li>• Menciona qué has intentado hasta ahora</li>
                        <li>• Sé paciente y agradecido con las respuestas</li>
                        <li>• Actualiza sobre el progreso de tu mascota</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-foreground mb-3">ℹ️ Asistencia / Informaciones</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">❓ Preguntas Frecuentes</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Permite a los usuarios hacer preguntas y tener respuestas a través de mods.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Revisa si tu pregunta ya fue respondida</li>
                        <li>• Sé específico en tus consultas</li>
                        <li>• Una pregunta por tema</li>
                        <li>• Respeta las respuestas de los moderadores</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">📢 Anuncios Técnicos</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Información oficial sobre el funcionamiento del foro.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Solo moderadores pueden publicar</li>
                        <li>• Lee todos los anuncios importantes</li>
                        <li>• Comenta solo si es necesario</li>
                        <li>• Mantente informado sobre cambios</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-foreground mb-3">👥 Comunidad</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">👋 Presentaciones</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Aquí los dueños se pueden hacer una presentación de sus mascotas para conocerse.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Cuenta un poco sobre ti y tus compañeros peludos</li>
                        <li>• Menciona experiencia con mascotas</li>
                        <li>• Sé amigable y da la bienvenida a otros</li>
                        <li>• Una presentación por usuario</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">☕ La Cafetería</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Conversaciones sobre otros temas que no sean del foro.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Mantén las conversaciones amigables</li>
                        <li>• Evita temas polémicos o divisivos</li>
                        <li>• Respeta las opiniones diferentes</li>
                        <li>• No spam ni autopromoción excesiva</li>
                        <li>• Mantén la relevancia con la comunidad</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-muted-foreground" />
                <span>Tabla de Infracciones y Consecuencias</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold text-foreground">Infracción</th>
                      <th className="text-left p-2 font-semibold text-foreground">Primera vez</th>
                      <th className="text-left p-2 font-semibold text-foreground">Reincidencia</th>
                      <th className="text-left p-2 font-semibold text-foreground">Grave/Múltiple</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2">Spam de productos</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                        >
                          Advertencia
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                        >
                          7 días
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        >
                          30 días
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Consejos médicos peligrosos</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                        >
                          14 días
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        >
                          30 días
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Promoción de maltrato animal</td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2">Acoso a otros miembros</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        >
                          14 días
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive">Permanente</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-foreground">
              <strong>🚨 Emergencias Veterinarias:</strong> Si tu mascota está en peligro inmediato, contacta a tu
              veterinario de emergencia local antes de publicar en el foro. El tiempo es crucial en situaciones médicas
              graves.
            </AlertDescription>
          </Alert>

          <Card className="border">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground">¿Necesitas ayuda con las reglas?</h3>
                <p className="text-sm text-muted-foreground">
                  Si tienes dudas sobre las reglas o quieres reportar contenido inapropiado, nuestro equipo de
                  moderación está aquí para ayudar.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  <Badge variant="outline" className="bg-transparent">
                    📧 soporte@miapp.com
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
