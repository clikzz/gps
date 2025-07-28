import { fetcher } from "@/lib/utils";

type Stats = { totalTopics: number; totalMessages: number };

export default async function ForumFooter() {
  let totalTopics = 0;
  let totalMessages = 0;

  try {
    const data = await fetcher<Stats>("/api/forum/stats");
    totalTopics = data.totalTopics;
    totalMessages = data.totalMessages;
  } catch (err) {
    console.error("Error fetching forum stats:", err);
  }

  return (
    <footer className="container mx-auto p-4 space-y-4">
      <div className="text-sm space-y-1">
        <div>
          Número total de temas:
          <span className="font-medium ml-1 text-secondary">{totalTopics}</span>
        </div>
        <div>
          Número total de mensajes:
          <span className="font-medium ml-1 text-secondary">{totalMessages}</span>
        </div>
      </div>
    </footer>
  );
}
