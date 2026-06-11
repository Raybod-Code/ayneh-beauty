export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'
export type UserRole = 'customer' | 'staff' | 'owner' | 'superadmin'
export type WaitlistStatus = 'waiting' | 'notified' | 'booked' | 'expired' | 'cancelled'
export type InsightType =
  | 'revenue_forecast'
  | 'no_show_risk'
  | 'busy_period'
  | 'staff_suggestion'
  | 'marketing_tip'

export interface Database {
  public: {
    Tables: {
      plans: {
        Row: {
          id: string
          name: Json
          slug: string
          price_monthly: number | null
          price_yearly: number | null
          features: Json
          limits: Json
          is_active: boolean
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['plans']['Insert']>
      }
      tenants: {
        Row: {
          id: string
          slug: string
          subdomain: string | null
          display_name: Json
          description: Json | null
          country: string
          timezone: string
          locale: string
          currency: string
          plan_id: string | null
          phone: string | null
          address: Json | null
          location: Json | null
          working_hours: Json
          branding: Json
          settings: Json
          ai_profile: Json
          social_links: Json
          is_active: boolean
          is_verified: boolean
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          phone: string | null
          email: string | null
          full_name: string | null
          avatar_url: string | null
          locale: string
          role: UserRole
          beauty_passport: Json
          face_profile: Json
          style_dna: Json
          skin_tone: string | null
          hair_type: string | null
          preferred_staff: string[]
          loyalty_points: number
          is_active: boolean
          last_seen_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      tenant_members: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          role: UserRole
          joined_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenant_members']['Row'], 'id' | 'joined_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['tenant_members']['Insert']>
      }
      staff: {
        Row: {
          id: string
          tenant_id: string
          user_id: string | null
          display_name: string
          bio: Json
          specialties: string[]
          skill_scores: Json
          portfolio: Json
          instagram: string | null
          rating: number
          total_reviews: number
          color_code: string
          is_accepting: boolean
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['staff']['Insert']>
      }
      services: {
        Row: {
          id: string
          tenant_id: string
          name: Json
          description: Json
          category: string
          subcategory: string | null
          duration_min: number
          buffer_min: number
          base_price: number
          dynamic_pricing: Json
          requires_patch_test: boolean
          requires_consultation: boolean
          ai_tags: string[]
          media: Json
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      staff_services: {
        Row: {
          id: string
          staff_id: string
          service_id: string
          price_override: number | null
          duration_override: number | null
        }
        Insert: Omit<Database['public']['Tables']['staff_services']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['staff_services']['Insert']>
      }
      schedules: {
        Row: {
          id: string
          staff_id: string
          day_of_week: number
          start_time: string
          end_time: string
          breaks: Json
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['schedules']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['schedules']['Insert']>
      }
      schedule_overrides: {
        Row: {
          id: string
          staff_id: string
          date: string
          is_off: boolean
          custom_start: string | null
          custom_end: string | null
          extra_breaks: Json
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['schedule_overrides']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['schedule_overrides']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          staff_id: string
          service_id: string
          start_at: string
          end_at: string
          jalali_date: string | null
          status: BookingStatus
          mood: string | null
          ai_recommendation: boolean
          face_snapshot: Json
          style_notes: string | null
          internal_notes: string | null
          base_price: number
          final_price: number
          discount_amount: number
          discount_reason: string | null
          payment_status: PaymentStatus
          payment_method: string | null
          zarinpal_authority: string | null
          zarinpal_ref_id: string | null
          digital_ticket_code: string
          qr_data: string | null
          reminder_24h_sent: boolean
          reminder_1h_sent: boolean
          followup_sent: boolean
          group_id: string | null
          is_group_leader: boolean
          no_show_risk: number
          rescheduled_from: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at' | 'digital_ticket_code'> & { id?: string; digital_ticket_code?: string }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      waitlist: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          service_id: string
          preferred_staff_id: string | null
          date_from: string | null
          date_to: string | null
          time_preference: string
          urgency: string
          status: WaitlistStatus
          notified_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['waitlist']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['waitlist']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          tenant_id: string
          staff_id: string
          customer_id: string
          rating: number
          comment: string | null
          before_url: string | null
          after_url: string | null
          tags: string[]
          is_public: boolean
          owner_reply: string | null
          replied_at: string | null
          sentiment_score: number | null
          helpful_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      products: {
        Row: {
          id: string
          tenant_id: string
          name: Json
          description: Json
          price: number
          compare_price: number | null
          stock: number
          sku: string | null
          images: Json
          category: string | null
          brand: string | null
          tags: string[]
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          items: Json
          total_price: number
          payment_status: PaymentStatus
          delivery_info: Json
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      loyalty_transactions: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          booking_id: string | null
          points: number
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['loyalty_transactions']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['loyalty_transactions']['Insert']>
      }
      gift_cards: {
        Row: {
          id: string
          tenant_id: string
          code: string
          amount: number
          remaining: number
          purchased_by: string | null
          recipient_name: string | null
          recipient_phone: string | null
          message: string | null
          design_template: string
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gift_cards']['Row'], 'id' | 'created_at' | 'code'> & { id?: string; code?: string }
        Update: Partial<Database['public']['Tables']['gift_cards']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string | null
          booking_id: string | null
          type: string
          channel: string
          content: Json
          status: string
          sent_at: string | null
          error: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      ai_insights: {
        Row: {
          id: string
          tenant_id: string
          type: InsightType
          payload: Json
          confidence: number
          valid_until: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_insights']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['ai_insights']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      booking_status: BookingStatus
      payment_status: PaymentStatus
      user_role: UserRole
      waitlist_status: WaitlistStatus
      insight_type: InsightType
    }
  }
}

// ─── Helper Types ───────────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// ─── Shorthand Types ─────────────────────────────────────
export type Tenant = Tables<'tenants'>
export type User = Tables<'users'>
export type Staff = Tables<'staff'>
export type Service = Tables<'services'>
export type Booking = Tables<'bookings'>
export type Review = Tables<'reviews'>
export type Plan = Tables<'plans'>
export type Product = Tables<'products'>
export type WaitlistEntry = Tables<'waitlist'>
export type GiftCard = Tables<'gift_cards'>
export type Notification = Tables<'notifications'>
export type AiInsight = Tables<'ai_insights'>

// ─── Extended Types با join ──────────────────────────────
export type BookingWithDetails = Booking & {
  service?: Service
  staff?: Staff
  customer?: User
}

export type StaffWithServices = Staff & {
  staff_services?: Array<{ service: Service }>
}

export type TenantWithPlan = Tenant & {
  plan?: Plan
}
