export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          cover_image: string | null
          author: string | null
          reading_time: string | null
          published: boolean | null
          site: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          cover_image?: string | null
          author?: string | null
          reading_time?: string | null
          published?: boolean | null
          site: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_image?: string | null
          author?: string | null
          reading_time?: string | null
          published?: boolean | null
          site?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_content: {
        Row: {
          id: string
          blog_id: string
          type: string
          content: string
          alt: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          blog_id: string
          type: string
          content: string
          alt?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          blog_id?: string
          type?: string
          content?: string
          alt?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_content_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: "admin" | "user"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: "admin" | "user"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: "admin" | "user"
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
