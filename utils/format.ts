export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return `Hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

export function formatTimeOnSale(createdAt: string, soldAt?: string): string {
  if (!soldAt) return "—";

  const createdMs = new Date(createdAt).getTime();
  const soldMs    = new Date(soldAt).getTime();
  let diffMs      = soldMs - createdMs;

  diffMs = Math.abs(diffMs);

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours   = Math.floor(diffMs / (1000 * 60 * 60));
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days >= 7) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  if (days >= 1) {
    return `${days} ${days === 1 ? "día" : "días"}`;
  }
  if (hours >= 1) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  if (minutes <= 1) {
    return "Menos de 1 minuto";
  }
  return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function extractYear(date: Date): number {
  return new Date(date).getFullYear();
}

export function getPriceColor(
  original: number,
  sold: number | null | undefined,
  isSold: boolean
): string {
  if (!isSold || sold == null) return "";
  if (sold > original) return "text-primary";
  if (sold < original) return "text-secondary";
  return "text-muted-foreground";
}