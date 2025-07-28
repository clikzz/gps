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
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span>{formatDateLabel(createdAt)}</span>
          <span>#REGLAS</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-48 border-b lg:border-b-0 lg:border-r p-4 bg-muted/30 lg:bg-transparent">
          <div className="flex flex-row lg:flex-col items-center lg:items-center gap-4 lg:gap-3 lg:text-center">
            <div className="text-center lg:space-y-1">
              <div className="font-medium text-sm">
                <span className="text-accent">{rulesAuthor.name}</span>
                <span className="text-gray-400"> #{rulesAuthor.tag}</span>
              </div>
              <div className="text-xs font-semibold text-destructive">Administrador</div>
            </div>
            <div className="flex flex-col items-center gap-2 lg:gap-3">
              <img
                src={rulesAuthor.avatar_url || "/placeholder.svg"}
                className="w-16 h-16 lg:w-24 lg:h-24 rounded border flex-shrink-0"
              />
            </div>
            <div className="flex lg:flex-col gap-4 lg:gap-1 lg:w-full">
              <div className="text-xs whitespace-nowrap">Mensajes: {rulesAuthor.menssageCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4 lg:p-6 min-h-[200px] space-y-4 sm:space-y-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Reglas del Foro de Mascotas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2">
              Estas reglas están diseñadas para mantener un ambiente seguro, respetuoso y útil para todos los amantes de
              las mascotas en nuestra comunidad.
            </p>
          </div>
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-foreground text-sm">
              <strong>Importante:</strong> Este foro está dedicado al bienestar animal. Cualquier contenido que promueva
              maltrato, negligencia o actividades ilegales relacionadas con animales resultará en baneo inmediato.
            </AlertDescription>
          </Alert>
          <Card className="border">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <span>Reglas Generales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {[
                  {
                    number: 1,
                    title: "Bienestar animal primero",
                    description:
                      "Todas las recomendaciones y consejos deben priorizar la salud y bienestar de las mascotas. No se toleran sugerencias que puedan dañar a los animales.",
                  },
                  {
                    number: 2,
                    title: "Respeto entre miembros",
                    description:
                      "Trata a todos con respeto, especialmente a los nuevos dueños de mascotas. Todos estamos aquí para aprender y ayudar. No juzgues las decisiones de otros sin conocer el contexto completo.",
                  },
                  {
                    number: 3,
                    title: "Consulta veterinaria obligatoria",
                    description:
                      "Para problemas de salud serios, siempre recomienda consultar a un veterinario. Los consejos del foro no sustituyen la atención médica profesional.",
                  },
                ].map((rule) => (
                  <div key={rule.number} className="space-y-2">
                    <h3 className="font-semibold text-foreground flex items-start space-x-2 text-sm sm:text-base">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {rule.number}
                      </span>
                      <span>{rule.title}</span>
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm ml-7 sm:ml-8">{rule.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <span>Normas Específicas por Sección</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-muted pl-3 sm:pl-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">🏠 Cuidado de Mascotas</h3>
                <div className="grid gap-3 sm:gap-4">
                  {[
                    {
                      icon: "🏥",
                      title: "Cuidados y Salud",
                      description: "Consejos sobre cuidados, salud y bienestar de nuestras mascotas.",
                      rules: [
                        "Incluye síntomas específicos y duración",
                        "Menciona edad, raza y peso de la mascota",
                        "Para emergencias, busca atención veterinaria inmediata",
                        "Comparte experiencias con tratamientos exitosos",
                        "Siempre recomienda consulta profesional para casos serios",
                      ],
                    },
                    {
                      icon: "🐕",
                      title: "Razas y Características",
                      description: "Información sobre diferentes razas de mascotas y sus características.",
                      rules: [
                        "Proporciona información precisa y verificada",
                        "Incluye temperamento, necesidades de ejercicio y cuidados",
                        "Menciona posibles problemas de salud hereditarios",
                        "Comparte experiencias personales con razas específicas",
                        "Evita estereotipos negativos sobre razas",
                      ],
                    },
                    {
                      icon: "🆘",
                      title: "Ayuda",
                      description: "Espacio para solicitar ayuda con problemas específicos de tus mascotas.",
                      rules: [
                        "Describe el problema de manera detallada",
                        "Menciona qué has intentado hasta ahora",
                        "Sé paciente y agradecido con las respuestas",
                        "Actualiza sobre el progreso de tu mascota",
                      ],
                    },
                  ].map((section, index) => (
                    <div key={index} className="bg-muted p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        {section.icon} {section.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{section.description}</p>
                      <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        {section.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex}>• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l-4 border-muted pl-3 sm:pl-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">
                  ℹ️ Asistencia / Informaciones
                </h3>
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                  {[
                    {
                      icon: "❓",
                      title: "Preguntas Frecuentes",
                      description: "Permite a los usuarios hacer preguntas y tener respuestas a través de mods.",
                      rules: [
                        "Revisa si tu pregunta ya fue respondida",
                        "Sé específico en tus consultas",
                        "Una pregunta por tema",
                        "Respeta las respuestas de los moderadores",
                      ],
                    },
                    {
                      icon: "📢",
                      title: "Anuncios Técnicos",
                      description: "Información oficial sobre el funcionamiento del foro.",
                      rules: [
                        "Solo moderadores pueden publicar",
                        "Lee todos los anuncios importantes",
                        "Comenta solo si es necesario",
                        "Mantente informado sobre cambios",
                      ],
                    },
                  ].map((section, index) => (
                    <div key={index} className="bg-muted p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        {section.icon} {section.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{section.description}</p>
                      <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        {section.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex}>• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l-4 border-muted pl-3 sm:pl-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">👥 Comunidad</h3>
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                  {[
                    {
                      icon: "👋",
                      title: "Presentaciones",
                      description: "Aquí los dueños se pueden hacer una presentación de sus mascotas para conocerse.",
                      rules: [
                        "Cuenta un poco sobre ti y tus compañeros peludos",
                        "Menciona experiencia con mascotas",
                        "Sé amigable y da la bienvenida a otros",
                        "Una presentación por usuario",
                      ],
                    },
                    {
                      icon: "☕",
                      title: "La Cafetería",
                      description: "Conversaciones sobre otros temas que no sean del foro.",
                      rules: [
                        "Mantén las conversaciones amigables",
                        "Evita temas polémicos o divisivos",
                        "Respeta las opiniones diferentes",
                        "No spam ni autopromoción excesiva",
                        "Mantén la relevancia con la comunidad",
                      ],
                    },
                  ].map((section, index) => (
                    <div key={index} className="bg-muted p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        {section.icon} {section.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{section.description}</p>
                      <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        {section.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex}>• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Gavel className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <span>Tabla de Infracciones y Consecuencias</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="block sm:hidden space-y-3">
                {[
                  {
                    infraction: "Spam de productos",
                    first: { text: "Advertencia", variant: "yellow" },
                    second: { text: "7 días", variant: "orange" },
                    multiple: { text: "30 días", variant: "red" },
                  },
                  {
                    infraction: "Consejos médicos peligrosos",
                    first: { text: "14 días", variant: "orange" },
                    second: { text: "30 días", variant: "red" },
                    multiple: { text: "Permanente", variant: "destructive" },
                  },
                  {
                    infraction: "Promoción de maltrato animal",
                    first: { text: "Permanente", variant: "destructive" },
                    second: { text: "Permanente", variant: "destructive" },
                    multiple: { text: "Permanente", variant: "destructive" },
                  },
                  {
                    infraction: "Acoso a otros miembros",
                    first: { text: "14 días", variant: "red" },
                    second: { text: "Permanente", variant: "destructive" },
                    multiple: { text: "Permanente", variant: "destructive" },
                  },
                ].map((row, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <h4 className="font-semibold text-sm">{row.infraction}</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">1ra vez</div>
                        <Badge
                          variant={row.first.variant === "destructive" ? "destructive" : "outline"}
                          className={
                            row.first.variant === "yellow"
                              ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                              : row.first.variant === "orange"
                                ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                                : row.first.variant === "red"
                                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                  : ""
                          }
                        >
                          {row.first.text}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">2da vez</div>
                        <Badge
                          variant={row.second.variant === "destructive" ? "destructive" : "outline"}
                          className={
                            row.second.variant === "orange"
                              ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                              : row.second.variant === "red"
                                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                : ""
                          }
                        >
                          {row.second.text}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Múltiple</div>
                        <Badge
                          variant={row.multiple.variant === "destructive" ? "destructive" : "outline"}
                          className={
                            row.multiple.variant === "red"
                              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                              : ""
                          }
                        >
                          {row.multiple.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block overflow-x-auto">
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
            <AlertDescription className="text-foreground text-sm">
              <strong>🚨 Emergencias Veterinarias:</strong> Si tu mascota está en peligro inmediato, contacta a tu
              veterinario de emergencia local antes de publicar en el foro. El tiempo es crucial en situaciones médicas
              graves.
            </AlertDescription>
          </Alert>
          <Card className="border">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">¿Necesitas ayuda con las reglas?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Si tienes dudas sobre las reglas o quieres reportar contenido inapropiado, nuestro equipo de
                  moderación está aquí para ayudar.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  <Badge variant="outline" className="bg-transparent text-xs sm:text-sm">
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
