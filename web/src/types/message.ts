import type { User } from './user'

export interface Content {
  text: string
}

export interface Message {
  id: number
  timestamp: number
  content: Content
  author: User
}