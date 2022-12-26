export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      Account: {
        Row: {
          balance: number
          id: string
          owner_id: string
        }
        Insert: {
          balance: number
          id?: string
          owner_id: string
        }
        Update: {
          balance?: number
          id?: string
          owner_id?: string
        }
      }
      Platform: {
        Row: {
          description: string | null
          id: string
          link: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          link: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          link?: string
          name?: string
        }
      }
      Service: {
        Row: {
          description: string | null
          id: string
          name: string
          platform_id: string
          price: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          platform_id: string
          price: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          platform_id?: string
          price?: number
        }
      }
      Transaction: {
        Row: {
          id: string
          payer_id: string
          payment: number
          reciever_id: string
        }
        Insert: {
          id?: string
          payer_id: string
          payment: number
          reciever_id: string
        }
        Update: {
          id?: string
          payer_id?: string
          payment?: number
          reciever_id?: string
        }
      }
      User: {
        Row: {
          email: string
          id: string
          name: string
        }
        Insert: {
          email: string
          id: string
          name: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

