import { Shield, AlertTriangle, Users, MessageSquare, Eye, Gavel, Clock, Ban, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForumRulesPage() {
  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center space-y-3 sm:space-y-4 px-2">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reglas del Foro</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Estas reglas están diseñadas para mantener un ambiente seguro, respetuoso y útil para todos los amantes de
            las mascotas en nuestra comunidad.
          </p>
        </div>

        <Alert className="border-destructive/50 bg-destructive/10 mx-2 sm:mx-0">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <AlertDescription className="text-foreground text-sm sm:text-base">
            <strong>Importante:</strong> Este foro está dedicado al bienestar animal. Cualquier contenido que promueva
            maltrato, negligencia o actividades ilegales relacionadas con animales resultará en baneo inmediato.
          </AlertDescription>
        </Alert>

        <Card className="border mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span>Reglas Generales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  number: "1",
                  title: "Bienestar animal primero",
                  description:
                    "Todas las recomendaciones y consejos deben priorizar la salud y bienestar de las mascotas. No se toleran sugerencias que puedan dañar a los animales.",
                },
                {
                  number: "2",
                  title: "Respeto entre miembros",
                  description:
                    "Trata a todos con respeto, especialmente a los nuevos dueños de mascotas. Todos estamos aquí para aprender y ayudar. No juzgues las decisiones de otros sin conocer el contexto completo.",
                },
                {
                  number: "3",
                  title: "Consulta veterinaria obligatoria",
                  description:
                    "Para problemas de salud serios, siempre recomienda consultar a un veterinario. Los consejos del foro no sustituyen la atención médica profesional.",
                },
              ].map((rule) => (
                <div key={rule.number} className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-foreground flex items-start space-x-2 sm:space-x-3">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                      {rule.number}
                    </span>
                    <span className="text-sm sm:text-base leading-tight">{rule.title}</span>
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm ml-8 sm:ml-10 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span>Directrices de Contenido</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">✅ Contenido Bienvenido</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {[
                    "Consejos de cuidado y entrenamiento",
                    "Preguntas sobre comportamiento animal",
                    "Recomendaciones de productos útiles",
                    "Historias de adopción y rescate",
                    "Información sobre razas y especies",
                    "Experiencias veterinarias",
                    "Consejos de alimentación saludable",
                  ].map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">❌ Contenido Prohibido</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {[
                    "Contenido de maltrato animal",
                    "Consejos médicos peligrosos",
                    "Promoción de peleas de animales",
                    "Contenido sexual con animales",
                    "Spam de productos comerciales",
                    "Información sobre cría irresponsable",
                    "Abandono o negligencia animal",
                  ].map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span>Normas Específicas por Sección</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-muted pl-3 sm:pl-4 space-y-4">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">🏠 Cuidado de Mascotas</h3>
              <div className="space-y-3 sm:space-y-4">
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
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base flex items-center space-x-2">
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed">
                      {section.description}
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {section.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="leading-relaxed">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-muted pl-3 sm:pl-4 space-y-4">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">ℹ️ Asistencia / Informaciones</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: "❓",
                    title: "Preguntas Frecuentes",
                    description: "Permite a los usuarios hacer preguntas y tener respuestas a través de mods.",
                    rules: [
                      "Revisa si tu pregunta ya fue respondida",
                      "Sé específico en tus consultas",
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
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base flex items-center space-x-2">
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed">
                      {section.description}
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {section.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="leading-relaxed">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-muted pl-3 sm:pl-4 space-y-4">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">👥 Comunidad</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base flex items-center space-x-2">
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed">
                      {section.description}
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {section.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="leading-relaxed">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span>Sistema de Moderación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: AlertTriangle,
                  title: "Advertencia",
                  subtitle: "Infracciones menores",
                  bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
                  iconColor: "text-yellow-600 dark:text-yellow-400",
                },
                {
                  icon: Clock,
                  title: "Suspensión Temporal",
                  subtitle: "3-30 días según gravedad",
                  bgColor: "bg-orange-100 dark:bg-orange-900/20",
                  iconColor: "text-orange-600 dark:text-orange-400",
                },
                {
                  icon: Ban,
                  title: "Baneo Permanente",
                  subtitle: "Maltrato animal o reincidencia",
                  bgColor: "bg-red-100 dark:bg-red-900/20",
                  iconColor: "text-red-600 dark:text-red-400",
                },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="text-center space-y-2 sm:space-y-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${item.bgColor} flex items-center justify-center mx-auto`}
                    >
                      <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.subtitle}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Gavel className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span>Tabla de Infracciones y Consecuencias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="block sm:hidden space-y-4">
              {[
                {
                  infraction: "Spam",
                  first: { text: "Advertencia", variant: "yellow" },
                  repeat: { text: "7 días", variant: "orange" },
                  severe: { text: "30 días", variant: "red" },
                },
                {
                  infraction: "Consejos médicos peligrosos",
                  first: { text: "14 días", variant: "orange" },
                  repeat: { text: "30 días", variant: "red" },
                  severe: { text: "Permanente", variant: "destructive" },
                },
                {
                  infraction: "Promover Venta ilegal de animales",
                  first: { text: "30 días", variant: "red" },
                  repeat: { text: "Permanente", variant: "destructive" },
                  severe: { text: "Permanente", variant: "destructive" },
                },
                {
                  infraction: "Promoción de maltrato animal",
                  first: { text: "Permanente", variant: "destructive" },
                  repeat: { text: "Permanente", variant: "destructive" },
                  severe: { text: "Permanente", variant: "destructive" },
                },
                {
                  infraction: "Acoso a otros miembros",
                  first: { text: "14 días", variant: "red" },
                  repeat: { text: "Permanente", variant: "destructive" },
                  severe: { text: "Permanente", variant: "destructive" },
                },
              ].map((row, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">{row.infraction}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Primera vez:</span>
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
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Reincidencia:</span>
                      <Badge
                        variant={row.repeat.variant === "destructive" ? "destructive" : "outline"}
                        className={
                          row.repeat.variant === "orange"
                            ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                            : row.repeat.variant === "red"
                              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                              : ""
                        }
                      >
                        {row.repeat.text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Grave/Múltiple:</span>
                      <Badge
                        variant={row.severe.variant === "destructive" ? "destructive" : "outline"}
                        className={
                          row.severe.variant === "red"
                            ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            : ""
                        }
                      >
                        {row.severe.text}
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
                    <th className="text-left p-2 sm:p-3 font-semibold text-foreground">Infracción</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-foreground">Primera vez</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-foreground">Reincidencia</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-foreground">Grave/Múltiple</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">Spam</td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs"
                      >
                        Advertencia
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs"
                      >
                        7 días
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs"
                      >
                        30 días
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">Consejos médicos peligrosos</td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs"
                      >
                        14 días
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs"
                      >
                        30 días
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">Promover Venta ilegal de animales</td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs"
                      >
                        30 días
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">Promoción de maltrato animal</td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">Acoso a otros miembros</td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs"
                      >
                        14 días
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="destructive" className="text-xs">
                        Permanente
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 mx-2 sm:mx-0">
          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <AlertDescription className="text-foreground text-sm sm:text-base">
            <strong>🚨 Emergencias Veterinarias:</strong> Si tu mascota está en peligro inmediato, contacta a tu
            veterinario de emergencia local antes de publicar en el foro. El tiempo es crucial en situaciones médicas
            graves.
          </AlertDescription>
        </Alert>

        <Card className="border mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">¿Necesitas ayuda con las reglas?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Si tienes dudas sobre las reglas o quieres reportar contenido inapropiado, nuestro equipo de moderación
                está aquí para ayudar.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-3 sm:mt-4">
                <Badge variant="outline" className="bg-transparent text-xs sm:text-sm">
                  📧 soporte@petly.com
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
