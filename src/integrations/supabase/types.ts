export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          achievement_type: string
          points: number
          created_at: string
          icon?: string
        }
        Insert: Omit<Tables['achievements']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['achievements']['Insert']>
      }
      activity_history: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          description: string
          created_at: string
          metadata: Json
        }
        Insert: Omit<Tables['activity_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['activity_history']['Insert']>
      }
      body_measurements: {
        Row: {
          id: string
          user_id: string
          date: string
          chest: number
          waist: number
          hips: number
          biceps: number
          thighs: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['body_measurements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['body_measurements']['Insert']>
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          start_date: string
          end_date: string
          event_type: string
          status: string
          location?: string
          reminder?: boolean
          reminder_time?: string
          created_at: string
        }
        Insert: Omit<Tables['calendar_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['calendar_events']['Insert']>
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string
          muscle_group: string
          equipment_needed: string[]
          difficulty: string
          instructions: string[]
          video_url?: string
          image_url?: string
          calories_per_hour?: number
          created_at: string
          updated_at: string
          metadata: Json
          category: string
        }
        Insert: Omit<Tables['exercises']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['exercises']['Insert']>
      }
      food_items: {
        Row: {
          id: string
          name: string
          brand?: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          fiber_per_100g?: number
          sodium_per_100g?: number
          barcode?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['food_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['food_items']['Insert']>
      }
      hydration_entries: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          created_at: string
        }
        Insert: Omit<Tables['hydration_entries']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['hydration_entries']['Insert']>
      }
      hydration_records: {
        Row: {
          id: string
          user_id: string
          date: string
          total_intake_ml: number
          goal_ml: number
          status: string
          notes?: string
          created_at: string
          updated_at: string
          achievement_unlocked: boolean
        }
        Insert: Omit<Tables['hydration_records']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['hydration_records']['Insert']>
      }
      meal_foods: {
        Row: {
          id: string
          meal_id: string
          food_item_id: string
          quantity: number
          unit: string
          notes?: string
          created_at: string
          order_index: number
          consumed: boolean
        }
        Insert: Omit<Tables['meal_foods']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['meal_foods']['Insert']>
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          meal_type: string
          planned_time: string
          actual_time?: string
          calories: number
          protein: number
          carbs: number
          fat: number
          created_at: string
          updated_at: string
          completed: boolean
          notes?: string
          nutrition_plan_id?: string
        }
        Insert: Omit<Tables['meals']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['meals']['Insert']>
      }
      nutrition_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          start_date: string
          end_date: string
          daily_calories: number
          protein_target: number
          carbs_target: number
          fat_target: number
          created_at: string
          updated_at: string
          status: string
        }
        Insert: Omit<Tables['nutrition_plans']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['nutrition_plans']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url?: string
          gender?: string
          birth_date?: string
          height?: number
          weight?: number
          activity_level?: string
          fitness_goal?: string
          created_at: string
          updated_at: string
          email: string
        }
        Insert: Omit<Tables['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['profiles']['Insert']>
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          date: string
          category: string
          notes?: string
          created_at: string
        }
        Insert: Omit<Tables['progress_photos']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['progress_photos']['Insert']>
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: Omit<Tables['user_achievements']['Row'], 'id'>
        Update: Partial<Tables['user_achievements']['Insert']>
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: string
          target_value: number
          current_value: number
          start_date: string
          target_date: string
          status: string
          notes?: string
        }
        Insert: Omit<Tables['user_goals']['Row'], 'id'>
        Update: Partial<Tables['user_goals']['Insert']>
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          language: string
          theme: string
          notifications_enabled: boolean
          measurement_unit: string
          timezone: string
          workout_reminder: boolean
          meal_reminder: boolean
          hydration_reminder: boolean
          created_at: string
          updated_at: string
          reminder_frequency: string
        }
        Insert: Omit<Tables['user_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['user_settings']['Insert']>
      }
      weight_progress: {
        Row: {
          id: string
          user_id: string
          weight: number
          date: string
          notes?: string
          created_at: string
        }
        Insert: Omit<Tables['weight_progress']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['weight_progress']['Insert']>
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          sets: number
          reps: number
          weight?: number
          duration?: number
          rest_time: number
          notes?: string
          order_index: number
          created_at: string
          completed: boolean
        }
        Insert: Omit<Tables['workout_exercises']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['workout_exercises']['Insert']>
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          duration: number
          calories_burned?: number
          workout_type: string
          difficulty: string
          equipment_needed: string[]
          created_at: string
          scheduled_date?: string
          completed: boolean
          notes?: string
        }
        Insert: Omit<Tables['workouts']['Row'], 'id' | 'created_at'>
        Update: Partial<Tables['workouts']['Insert']>
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

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
