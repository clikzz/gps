
export interface ForumCategoryProps {
  category: {
    id: string
    name: string
    subforums: Array<{
      id: number
      name: string
      slug: string
      description: string
      topicCount: number
      messageCount: number
      lastPost: any
    }>
  }
}

export interface NewTopicFormProps {
  subforumSlug: string
  subforumId: number
}

export interface ReplyFormProps {
  topicId: number
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
  }
}

export interface ReplyListProps {
  replies: Reply[]
}

export interface TopicDetailProps {
  topic: {
    id: number
    title: string
    createdAt: string
    userRole: string
    currentUserId: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
    }
  }
  mainPost: {
    content: string
    createdAt: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
    }
  } | null
}

export interface Topic {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  author: {
    name: string
    id: string
    tag: number
  }
  postsCount: number
}

export interface TopicListProps {
  topics: Topic[]
  subforumSlug: string
  subforumId?: number
}
