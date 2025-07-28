"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Star, Clock, X, Car, Info, Phone, MessageSquare, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NewReviewDrawer } from "./NewReviewDrawer"
import { ReviewActions } from "./ReviewActions"
import { useUserProfile } from "@/stores/userProfile"
import ConfirmationButton from "@/components/ConfirmationButton"

interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  users: {
    id: string
    name?: string
    email: string
    avatar_url?: string
  }
}

interface ServiceDetailTabsProps {
  service: {
    id: string
    name: string
    address: string
    lat: number
    lng: number
    category: string
    categories?: string[]
    distance?: number
    routeDistance?: string
    routeDuration?: string
    description?: string
    phone?: string
  }
  onClose: () => void
  onCalculateRoute?: (service: any) => void
  onEditService?: (service: any) => void
  onDeleteService?: () => void
}

export function ServiceDetailTabs({ service, onClose, onCalculateRoute, onEditService, onDeleteService }: ServiceDetailTabsProps) {
  const { user } = useUserProfile()
  const [activeTab, setActiveTab] = useState("resumen")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [resolvedAddress, setResolvedAddress] = useState(service.address)
  const [loadingAddress, setLoadingAddress] = useState(false)

  useEffect(() => {
    if (user) {
      setReviews([])
      fetchReviews()
    }
  }, [service.id, user])

  useEffect(() => {
    const fetchReverseGeocode = async () => {
      if (!service.lat || !service.lng) return

      setLoadingAddress(true)
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${service.lng},${service.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,poi`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name
            setResolvedAddress(address)
          } else {
            setResolvedAddress(`${service.lat.toFixed(6)}, ${service.lng.toFixed(6)}`)
          }
        } else {
          console.error("Error en la respuesta de Mapbox")
          setResolvedAddress(service.address || `${service.lat.toFixed(6)}, ${service.lng.toFixed(6)}`)
        }
      } catch (error) {
        console.error("Error al obtener dirección con Mapbox:", error)
        setResolvedAddress(service.address || `${service.lat.toFixed(6)}, ${service.lng.toFixed(6)}`)
      } finally {
        setLoadingAddress(false)
      }
    }

    const shouldFetchAddress = !service.address ||
                              service.address.trim() === "" ||
                              /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(service.address) ||
                              service.address.includes("lat:")

    if (shouldFetchAddress && service.lat && service.lng) {
      fetchReverseGeocode()
    }
  }, [service.address, service.lat, service.lng])

  const getCategoryEmoji = (category: string): string => {
    switch (category.toLowerCase()) {
      case "veterinaria": return "🏥"
      case "peluqueria": return "✂️"
      case "tienda": return "🛒"
      case "guarderia": return "🏠"
      case "adiestramiento": return "🎓"
      case "adopcion": return "❤️"
      default: return "🐾"
    }
  }

  const fetchReviews = async () => {
    if (!user) return
    setLoading(true)
    try {
      const serviceId = service.id.replace("custom-", "").split("-")[0]
      const response = await fetch(`/api/reviews?service_id=${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewCreated = () => {
    setReviewDrawerOpen(false)
    fetchReviews()
  }

  const handleCalculateRoute = async () => {
    if (onCalculateRoute) {
      setLoadingRoute(true)
      try {
        await onCalculateRoute(service)
      } finally {
        setLoadingRoute(false)
      }
    }
  }

  const handleEditService = () => {
    if (onEditService) {
      onEditService(service)
    }
  }

  const handleDeleteService = async () => {
    try {
      const serviceId = service.id.replace("custom-", "").split("-")[0]
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Servicio eliminado correctamente")
        if (onDeleteService) {
          onDeleteService()
        }
        onClose()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        toast.error(errorData.error || "Error al eliminar el servicio")
        throw new Error(errorData.error || "Error al eliminar el servicio")
      }
    } catch (error) {
      console.error("Error al eliminar servicio:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error inesperado al eliminar el servicio")
      }
      throw error
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const calculateAverageRating = () =>
    reviews.length === 0
      ? 0
      : Math.round((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length) * 10) / 10

  const hasUserReviewed = () => {
    if (!user) return false
    return reviews.some(review => review.users.id === user.id)
  }

  return (
    <div className="h-full flex flex-col bg-background shadow-2xl border-r border-border">
      <div className="bg-gradient-to-r from-muted to-background border-b border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl mr-4 shadow-sm">
                {getCategoryEmoji(service.category)}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-xl leading-tight break-words">{service.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
            {onEditService && (
              <Button
                onClick={handleEditService}
                variant="ghost"
                size="icon"
                title="Editar servicio"
              >
                <Edit className="w-5 h-5" />
              </Button>
            )}
            {onDeleteService && (
              <ConfirmationButton
                onConfirm={handleDeleteService}
                triggerText={<Trash2 className="w-5 h-5" />}
                dialogTitle="Eliminar servicio"
                dialogDescription={`¿Estás seguro de que deseas eliminar el servicio "${service.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="ghost"
                size="icon"
              />
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {reviews.length > 0 && (
          <div className="flex justify-center mt-2">
            <div className="flex items-center space-x-2 text-sm px-3 py-2 rounded-lg">
              {renderStars(calculateAverageRating())}
              <span className="text-foreground">
                {calculateAverageRating().toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviews.length} reseña{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-border bg-background">
        <div className="flex px-6 justify-center">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === "resumen"
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab("resenas")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 relative ${
              activeTab === "resenas"
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
            }`}
          >
            Reseñas
            {reviews.length > 0 && (
              <span className="ml-2 bg-foreground text-background text-xs px-2 py-0.5 rounded-full font-medium">
                {reviews.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "resumen" && (
          <div className="p-6 space-y-6">
            {/* Categorías */}
            {service.categories && service.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-lg text-sm font-medium text-foreground"
                  >
                    <span>{getCategoryEmoji(category)}</span>
                    <span>{category}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {service.phone && (
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-muted-foreground flex-shrink-0" />
                      <a
                        href={`tel:${service.phone}`}
                        className="font-medium text-muted-foreground hover:underline"
                      >
                        {service.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {service.description && (
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 mr-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background">
                <CardContent className="p-5">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      {loadingAddress ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                          <span className="text-sm text-muted-foreground">Obteniendo dirección...</span>
                        </div>
                      ) : (
                        <p className="text-foreground leading-relaxed">{resolvedAddress}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {service.distance && (
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <Navigation className="w-5 h-5 mr-3 ttext-muted-foreground flex-shrink-0" />
                      <span className="font-semibold text-muted-foreground">
                        {service.distance} km de distancia
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {service.routeDistance && service.routeDuration && (
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {service.routeDistance} • {service.routeDuration} en auto
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {onCalculateRoute && (
              <div className="pt-6 border-t border-border">
                <Button
                  type="submit"
                  onClick={handleCalculateRoute}
                  className="w-full"
                  disabled={loadingRoute}
                >
                  {loadingRoute ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                      Calculando ruta...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 mr-2" />
                      {service.routeDistance ? "Recalcular ruta" : "Mostrar ruta"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "resenas" && (
          <div className="p-6">
            <div className="space-y-6">
              {user && (
                <>
                  {hasUserReviewed() ? (
                    <div className="w-full p-4 bg-muted/50 border border-border rounded-lg text-center">
                      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">Ya has dejado una reseña en este servicio</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Puedes editarla o eliminarla en tu reseña existente
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      onClick={() => setReviewDrawerOpen(true)}
                      className="w-full"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Escribir reseña
                    </Button>
                  )}
                </>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Cargando reseñas...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card
                      key={review.id}
                      className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-background"
                    >
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="relative flex-shrink-0">
                                {review.users.avatar_url ? (
                                  <>
                                    <img
                                      src={review.users.avatar_url}
                                      alt={review.users.name || review.users.email}
                                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        const fallback = target.nextElementSibling as HTMLElement
                                        if (fallback) fallback.classList.remove('hidden')
                                      }}
                                    />
                                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hidden">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {(review.users.name || review.users.email.split("@")[0]).charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {(review.users.name || review.users.email.split("@")[0]).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-foreground">
                                    {review.users.name || review.users.email.split("@")[0]}
                                  </p>
                                  {user && review.users.id === user.id && (
                                    <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                                      Tú
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                              </div>
                            </div>

                            {user && review.users.id === user.id && (
                              <div className="flex-shrink-0 ml-4">
                                <ReviewActions
                                  reviewId={review.id}
                                  currentRating={review.rating}
                                  currentComment={review.comment}
                                  onReviewUpdated={fetchReviews}
                                />
                              </div>
                            )}
                          </div>

                          <div className="pl-13">
                            {renderStars(review.rating)}
                          </div>

                          {review.comment && (
                            <p className="text-foreground leading-relaxed pl-13">{review.comment}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">No hay reseñas aún</p>
                  <p className="text-sm text-muted-foreground">Sé el primero en dejar una reseña</p>
                </div>
              )}

              {!user && (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">Inicia sesión para ver y dejar reseñas</p>
                </div>
              )}

              {user && (
                <NewReviewDrawer
                  serviceId={service.id.replace("custom-", "").split("-")[0]}
                  serviceName={service.name}
                  open={reviewDrawerOpen}
                  onOpenChange={setReviewDrawerOpen}
                  onReviewCreated={handleReviewCreated}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
