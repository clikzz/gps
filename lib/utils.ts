import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// esta función se usa para hacer peticiones a la API
// y manejar errores de forma más fácil
// se usa en componentes que necesitan datos de la API como en el foro (:
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const mensaje = json?.error || "Error al cargar datos";
    throw new Error(mensaje);
  }
  return (await res.json()) as T;
}