export function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate)
  const now  = new Date()
  const pad  = (n: number) => n.toString().padStart(2, "0")
  const hrs  = `${pad(date.getHours())}:${pad(date.getMinutes())}`


  if (date.toDateString() === now.toDateString()) {
    return `Hoy a las ${hrs}`
  }

  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (date.toDateString() === y.toDateString()) {
    return `Ayer a las ${hrs}`
  }

  const day = date.toLocaleDateString()
  return `${day} ${hrs}`
}
