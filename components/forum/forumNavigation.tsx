import Link from "next/link"

export function ForumNavigation() {
  return (
    <nav className="bg-card text-card-foreground border rounded-full mb-4 py-2 px-4 mx-auto container max-w-md">
      <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <li>
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
        </li>
        <li className="before:content-['-'] before:mx-2">
          <Link href="/forum/members" className="hover:underline">
            Miembros
          </Link>
        </li>
      </ul>
    </nav>
  )
}
