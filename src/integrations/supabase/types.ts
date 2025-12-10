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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          amenities: Json | null
          barangay: string
          cleaning_fee: number | null
          consent_given: boolean | null
          contact_email: string
          contact_name: string
          contact_number: string
          created_at: string | null
          description: string | null
          destination: string | null
          facebook_page: string | null
          featured: boolean | null
          gis_document_url: string | null
          google_maps_link: string | null
          id: string
          imported_from_airbnb: boolean | null
          instagram: string | null
          latitude: number | null
          longitude: number | null
          municipality_city: string
          name: string
          number_of_units: number
          permit_document_url: string | null
          province: string
          region: string
          resort_title: string | null
          sec_download_url: string | null
          status: string | null
          street_address: string
          updated_at: string | null
          website: string | null
          wifi_download_speed: number | null
          wifi_jitter: number | null
          wifi_ping: number | null
          wifi_providers: Json | null
          wifi_upload_speed: number | null
          zip_code: string
        }
        Insert: {
          amenities?: Json | null
          barangay: string
          cleaning_fee?: number | null
          consent_given?: boolean | null
          contact_email: string
          contact_name: string
          contact_number: string
          created_at?: string | null
          description?: string | null
          destination?: string | null
          facebook_page?: string | null
          featured?: boolean | null
          gis_document_url?: string | null
          google_maps_link?: string | null
          id?: string
          imported_from_airbnb?: boolean | null
          instagram?: string | null
          latitude?: number | null
          longitude?: number | null
          municipality_city: string
          name: string
          number_of_units: number
          permit_document_url?: string | null
          province: string
          region: string
          resort_title?: string | null
          sec_download_url?: string | null
          status?: string | null
          street_address: string
          updated_at?: string | null
          website?: string | null
          wifi_download_speed?: number | null
          wifi_jitter?: number | null
          wifi_ping?: number | null
          wifi_providers?: Json | null
          wifi_upload_speed?: number | null
          zip_code: string
        }
        Update: {
          amenities?: Json | null
          barangay?: string
          cleaning_fee?: number | null
          consent_given?: boolean | null
          contact_email?: string
          contact_name?: string
          contact_number?: string
          created_at?: string | null
          description?: string | null
          destination?: string | null
          facebook_page?: string | null
          featured?: boolean | null
          gis_document_url?: string | null
          google_maps_link?: string | null
          id?: string
          imported_from_airbnb?: boolean | null
          instagram?: string | null
          latitude?: number | null
          longitude?: number | null
          municipality_city?: string
          name?: string
          number_of_units?: number
          permit_document_url?: string | null
          province?: string
          region?: string
          resort_title?: string | null
          sec_download_url?: string | null
          status?: string | null
          street_address?: string
          updated_at?: string | null
          website?: string | null
          wifi_download_speed?: number | null
          wifi_jitter?: number | null
          wifi_ping?: number | null
          wifi_providers?: Json | null
          wifi_upload_speed?: number | null
          zip_code?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          accommodation_id: string
          check_in: string
          check_out: string
          created_at: string
          guest_count: number
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          notes: string | null
          status: string
          total_price: number
          unit_type_id: string | null
          updated_at: string
        }
        Insert: {
          accommodation_id: string
          check_in: string
          check_out: string
          created_at?: string
          guest_count?: number
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_price: number
          unit_type_id?: string | null
          updated_at?: string
        }
        Update: {
          accommodation_id?: string
          check_in?: string
          check_out?: string
          created_at?: string
          guest_count?: number
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_price?: number
          unit_type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_unit_type_id_fkey"
            columns: ["unit_type_id"]
            isOneToOne: false
            referencedRelation: "unit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          description: string | null
          destination: string
          duration: string | null
          id: string
          images: Json | null
          included: Json | null
          price: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination: string
          duration?: string | null
          id?: string
          images?: Json | null
          included?: Json | null
          price: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination?: string
          duration?: string | null
          id?: string
          images?: Json | null
          included?: Json | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      extra_links: {
        Row: {
          accommodation_id: string
          created_at: string | null
          id: string
          url: string
        }
        Insert: {
          accommodation_id: string
          created_at?: string | null
          id?: string
          url: string
        }
        Update: {
          accommodation_id?: string
          created_at?: string | null
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "extra_links_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          accommodation_id: string
          created_at: string | null
          id: string
          image_url: string
        }
        Insert: {
          accommodation_id: string
          created_at?: string | null
          id?: string
          image_url: string
        }
        Update: {
          accommodation_id?: string
          created_at?: string | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          accommodation_id: string
          created_at: string
          guest_email: string | null
          guest_name: string
          id: string
          rating: number
          review_text: string | null
        }
        Insert: {
          accommodation_id: string
          created_at?: string
          guest_email?: string | null
          guest_name: string
          id?: string
          rating: number
          review_text?: string | null
        }
        Update: {
          accommodation_id?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string
          id?: string
          rating?: number
          review_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_types: {
        Row: {
          accommodation_id: string
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          guests: number | null
          id: string
          price: number
          source_url: string | null
          unit_name: string
        }
        Insert: {
          accommodation_id: string
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          guests?: number | null
          id?: string
          price: number
          source_url?: string | null
          unit_name: string
        }
        Update: {
          accommodation_id?: string
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          guests?: number | null
          id?: string
          price?: number
          source_url?: string | null
          unit_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_types_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_booking_availability: {
        Args: {
          p_accommodation_id: string
          p_check_in: string
          p_check_out: string
          p_exclude_booking_id?: string
        }
        Returns: boolean
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
