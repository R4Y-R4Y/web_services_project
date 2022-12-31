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
      Account: {
        Row: {
          id: string
          balance: number
          owner_id: string
        }
        Insert: {
          id?: string
          balance: number
          owner_id: string
        }
        Update: {
          id?: string
          balance?: number
          owner_id?: string
        }
      }
      Platform: {
        Row: {
          id: string
          name: string
          link: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          link: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          link?: string
          description?: string | null
        }
      }
      Service: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          platform_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          platform_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          platform_id?: string
        }
      }
      Transaction: {
        Row: {
          id: string
          payment: number
          payer_id: string
          reciever_id: string
        }
        Insert: {
          id?: string
          payment: number
          payer_id: string
          reciever_id: string
        }
        Update: {
          id?: string
          payment?: number
          payer_id?: string
          reciever_id?: string
        }
      }
      User: {
        Row: {
          id: string
          email: string
          name: string
        }
        Insert: {
          id: string
          email: string
          name: string
        }
        Update: {
          id?: string
          email?: string
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
