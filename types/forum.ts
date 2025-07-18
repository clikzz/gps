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
}
