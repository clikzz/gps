
"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/utils";

interface Subforum {
  id: number;
  name: string;
  description?: string;
}

export default function ForumHomePage() {
  const { data: subforums, error } = useSWR<Subforum[]>("/api/forum/subforums", fetcher);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-red-500">Error al cargar subforos: {error.message}</p>
      </div>
    );
  }
  if (!subforums) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p>Cargando subforos…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="border rounded-lg p-4">
        <h1 className="text-2xl font-bold">Cuidado de Mascotas</h1>
      </div>

      <div className="space-y-3">
        {subforums.map((sf) => (
          <Link
            key={sf.id}
            href={`/protected/forum/${sf.id}`}
            className="block border rounded-lg p-4 hover:shadow-sm transition"
          >
            <h2 className="text-lg font-semibold">{sf.name}</h2>
            {sf.description && <p className="text-sm text-gray-600 mt-1">{sf.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
