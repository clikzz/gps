import { ForumNavigation } from "@/components/forum/forumNavigation"
import ForumFooter from "@/components/forum/forumFooter"
import { MembersSearch, ForumUser } from "@/components/forum/membersSearch"
import { fetcher } from "@/lib/utils"


export default async function MembersPage() {
  const users = await fetcher<ForumUser[]>("/api/forum/users")

  return (
    <div className="min-h-screen flex flex-col">
      <ForumNavigation />

      <main className="flex-1 container mx-auto p-4 space-y-4">
        <MembersSearch users={users} />
      </main>

      <ForumFooter />
    </div>
  )
}
