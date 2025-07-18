export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return `hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  const days = Math.floor(hours / 24);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}