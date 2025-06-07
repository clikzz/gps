import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// esta función se usa para hacer peticiones a la API
// y manejar errores de forma más fácil
// se usa en componentes que necesitan datos de la API como en el foro (:
const BASE_URL =
  typeof window !== "undefined"
    ? "" 
    : process.env.NEXT_PUBLIC_BASE_URL; 
export async function fetcher<T>(path: string): Promise<T> {
  const url = path.startsWith("/") ? `${BASE_URL}${path}` : path;
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
