export interface ForumTopic {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  postsCount: number
  author: {
    id: string
    name: string
    tag: number
  }
  locked: boolean
  featured: boolean
  lastPost: {
    createdAt: string;
    author: { id: string; name: string | null; tag: number };
  } | null;
}

export interface Reply {
  id: number
  content: string
  createdAt: string
  author: {
    name: string
    id: string
    tag: number
    menssageCount: number
    avatar_url?: string
    badges?: Badge[]
  }
}

export interface Badge { id: number; label: string; icon?: string; }