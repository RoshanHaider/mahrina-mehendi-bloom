export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          estimated_revenue: number
          id: string
          location: string
          notes: string | null
          preferred_date: string
          service_type: string
          status: string
          time_slot: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          estimated_revenue?: number
          id?: string
          location: string
          notes?: string | null
          preferred_date: string
          service_type: string
          status?: string
          time_slot: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          estimated_revenue?: number
          id?: string
          location?: string
          notes?: string | null
          preferred_date?: string
          service_type?: string
          status?: string
          time_slot?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          city: string
          created_at: string
          customer_address: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_fee: number
          discount: number
          id: string
          items: Json
          notes: string | null
          status: string
          subtotal: number
          total: number
        }
        Insert: {
          city: string
          created_at?: string
          customer_address: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_fee?: number
          discount?: number
          id?: string
          items: Json
          notes?: string | null
          status?: string
          subtotal: number
          total: number
        }
        Update: {
          city?: string
          created_at?: string
          customer_address?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number
          discount?: number
          id?: string
          items?: Json
          notes?: string | null
          status?: string
          subtotal?: number
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean
          low_stock_threshold: number
          name: string
          price: number
          stock_quantity: number
        }
        Insert: {
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          low_stock_threshold?: number
          name: string
          price: number
          stock_quantity?: number
        }
        Update: {
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          low_stock_threshold?: number
          name?: string
          price?: number
          stock_quantity?: number
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          created_at: string
          cta_text: string | null
          id: string
          image_url: string | null
          kind: string
          media_type: string
          sort_order: number
          subtitle: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_text?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          media_type?: string
          sort_order?: number
          subtitle?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_text?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          media_type?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          admin_password_hash: string | null
          admin_username: string
          bulk_discount_min_items: number
          bulk_discount_percent: number
          delivery_fee: number
          id: number
          logo_url: string | null
          support_email: string
          visit_address: string | null
          visit_label: string | null
          visit_map_url: string | null
          whatsapp_number: string
        }
        Insert: {
          admin_password_hash?: string | null
          admin_username?: string
          bulk_discount_min_items?: number
          bulk_discount_percent?: number
          delivery_fee?: number
          id?: number
          logo_url?: string | null
          support_email?: string
          visit_address?: string | null
          visit_label?: string | null
          visit_map_url?: string | null
          whatsapp_number?: string
        }
        Update: {
          admin_password_hash?: string | null
          admin_username?: string
          bulk_discount_min_items?: number
          bulk_discount_percent?: number
          delivery_fee?: number
          id?: number
          logo_url?: string | null
          support_email?: string
          visit_address?: string | null
          visit_label?: string | null
          visit_map_url?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          label: string
          platform: string
          sort_order: number
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          platform: string
          sort_order?: number
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          platform?: string
          sort_order?: number
          url?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
