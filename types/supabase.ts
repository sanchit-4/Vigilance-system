// This file is a manual translation of the provided DBML schema.
// For a real project, you would use `supabase gen types typescript > types/supabase.ts`

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
      guards: {
        Row: {
          id: number
          created_at: string
          name: string
          address: string | null
          date_of_birth: string | null
          date_of_joining: string
          police_verification_status: "Pending" | "Verified" | "Rejected"
          category: "Guard" | "Gunman" | "Supervisor" | "Security Officer" | "Lady Guard"
          date_of_exit: string | null
          contact_info: string | null
          base_salary: number
          is_active: boolean
          user_id: string | null
          role: "admin" | "supervisor" | "guard"
        }
        Insert: Omit<Database['public']['Tables']['guards']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['guards']['Insert']>
      }
      clients: {
        Row: {
          id: number
          created_at: string
          name: string
          address: string | null
          phone_1: string | null
          phone_2: string | null
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      locations: {
        Row: {
          id: number
          client_id: number
          created_at: string
          site_name: string
          address: string | null
          latitude: number
          longitude: number
          geofence_radius_meters: number
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }
      inventory_items: {
        Row: {
          id: number
          item_name: string
          value: number
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
      attendance: {
        Row: {
          id: number
          guard_id: number
          location_id: number
          check_in_time: string
          is_within_geofence: boolean
          status: "Pending Approval" | "Approved" | "Rejected"
          confirmed_by_supervisor_id: number | null
          confirmation_timestamp: string | null
        }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      salary_advances: {
        Row: {
          id: number
          guard_id: number
          amount: number
          advance_date: string
          recovery_amount_per_period: number
          is_fully_recovered: boolean
        }
        Insert: Omit<Database['public']['Tables']['salary_advances']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['salary_advances']['Insert']>
      }
      guard_assignments: {
        Row: {
          id: number
          guard_id: number
          location_id: number
          assignment_date: string
        }
        Insert: Omit<Database['public']['Tables']['guard_assignments']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['guard_assignments']['Insert']>
      }
      assigned_inventory: {
        Row: {
          id: number
          guard_id: number
          item_id: number
          assigned_date: string
          status: "Issued" | "Lost" | "Damaged" | "Returned"
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['assigned_inventory']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['assigned_inventory']['Insert']>
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}