export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      activity_history: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string
          id: string
          points_earned: number | null
          user_id: string
        }
        Insert: {
          activity_data: Json
          activity_type: string
          created_at?: string
          id?: string
          points_earned?: number | null
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string
          id?: string
          points_earned?: number | null
          user_id?: string
        }
        Relationships: []
      }
      body_measurements: {
        Row: {
          arm_cm: number | null
          chest_cm: number | null
          created_at: string
          hip_cm: number | null
          id: string
          notes: string | null
          recorded_date: string
          thigh_cm: number | null
          user_id: string
          waist_cm: number | null
        }
        Insert: {
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          notes?: string | null
          recorded_date: string
          thigh_cm?: number | null
          user_id: string
          waist_cm?: number | null
        }
        Update: {
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          notes?: string | null
          recorded_date?: string
          thigh_cm?: number | null
          user_id?: string
          waist_cm?: number | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          reminder_minutes: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          event_date: string
          event_time?: string | null
          event_type: string
          id?: string
          reminder_minutes?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          reminder_minutes?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          calories_per_minute: number | null
          created_at: string
          description: string | null
          difficulty_level: Database["public"]["Enums"]["experience_level"]
          duration_seconds: number | null
          equipment_required:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          id: string
          image_url: string | null
          instructions: string | null
          muscle_groups: string[] | null
          name: string
          rest_seconds: number | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          calories_per_minute?: number | null
          created_at?: string
          description?: string | null
          difficulty_level: Database["public"]["Enums"]["experience_level"]
          duration_seconds?: number | null
          equipment_required?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          muscle_groups?: string[] | null
          name: string
          rest_seconds?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          calories_per_minute?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["experience_level"]
          duration_seconds?: number | null
          equipment_required?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          muscle_groups?: string[] | null
          name?: string
          rest_seconds?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      food_items: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_per_100g: number
          carbs_per_100g: number
          created_at: string
          fat_per_100g: number
          fiber_per_100g: number | null
          id: string
          name: string
          protein_per_100g: number
          sodium_per_100g: number | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g: number
          carbs_per_100g: number
          created_at?: string
          fat_per_100g: number
          fiber_per_100g?: number | null
          id?: string
          name: string
          protein_per_100g: number
          sodium_per_100g?: number | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number
          created_at?: string
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          name?: string
          protein_per_100g?: number
          sodium_per_100g?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hydration_entries: {
        Row: {
          amount_ml: number
          hydration_record_id: string
          id: string
          recorded_at: string
        }
        Insert: {
          amount_ml: number
          hydration_record_id: string
          id?: string
          recorded_at?: string
        }
        Update: {
          amount_ml?: number
          hydration_record_id?: string
          id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hydration_entries_hydration_record_id_fkey"
            columns: ["hydration_record_id"]
            isOneToOne: false
            referencedRelation: "hydration_records"
            referencedColumns: ["id"]
          },
        ]
      }
      hydration_records: {
        Row: {
          consumed_ml: number | null
          created_at: string
          daily_goal_ml: number
          date: string
          id: string
          reminder_interval_minutes: number | null
          silent_hours_end: string | null
          silent_hours_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consumed_ml?: number | null
          created_at?: string
          daily_goal_ml: number
          date: string
          id?: string
          reminder_interval_minutes?: number | null
          silent_hours_end?: string | null
          silent_hours_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consumed_ml?: number | null
          created_at?: string
          daily_goal_ml?: number
          date?: string
          id?: string
          reminder_interval_minutes?: number | null
          silent_hours_end?: string | null
          silent_hours_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_foods: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          fat: number
          food_item_id: string
          id: string
          meal_id: string
          protein: number
          quantity_grams: number
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          fat: number
          food_item_id: string
          id?: string
          meal_id: string
          protein: number
          quantity_grams: number
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fat?: number
          food_item_id?: string
          id?: string
          meal_id?: string
          protein?: number
          quantity_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          consumed_at: string | null
          created_at: string
          id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          notes: string | null
          nutrition_plan_id: string | null
          photo_url: string | null
          planned_date: string
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          id?: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          notes?: string | null
          nutrition_plan_id?: string | null
          photo_url?: string | null
          planned_date: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          id?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          name?: string
          notes?: string | null
          nutrition_plan_id?: string | null
          photo_url?: string | null
          planned_date?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plans: {
        Row: {
          created_at: string
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_protein: number
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_protein: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_protein?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          available_equipment:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          avatar_url: string | null
          created_at: string
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          fitness_goal: Database["public"]["Enums"]["fitness_goal"] | null
          full_name: string
          height: number | null
          id: string
          updated_at: string
          user_id: string
          weekly_availability: Json | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          available_equipment?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          avatar_url?: string | null
          created_at?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name: string
          height?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weekly_availability?: Json | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          available_equipment?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          avatar_url?: string | null
          created_at?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name?: string
          height?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weekly_availability?: Json | null
          weight?: number | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          photo_type: string | null
          photo_url: string
          recorded_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_type?: string | null
          photo_url: string
          recorded_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_type?: string | null
          photo_url?: string
          recorded_date?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string
          created_at: string
          currency: string | null
          customer_id: string
          id: string
          payment_intent_id: string | null
          payment_status: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount_subtotal?: number | null
          amount_total?: number | null
          checkout_session_id: string
          created_at?: string
          currency?: string | null
          customer_id: string
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount_subtotal?: number | null
          amount_total?: number | null
          checkout_session_id?: string
          created_at?: string
          currency?: string | null
          customer_id?: string
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          id: string
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: string | null
          subscription_id: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          current_value: number | null
          goal_type: string
          id: string
          is_active: boolean | null
          target_date: string | null
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notification_email: boolean | null
          notification_hydration: boolean | null
          notification_meal: boolean | null
          notification_progress: boolean | null
          notification_workout: boolean | null
          theme_preference: string | null
          timezone: string | null
          units_distance: string | null
          units_weight: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_email?: boolean | null
          notification_hydration?: boolean | null
          notification_meal?: boolean | null
          notification_progress?: boolean | null
          notification_workout?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          units_distance?: string | null
          units_weight?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_email?: boolean | null
          notification_hydration?: boolean | null
          notification_meal?: boolean | null
          notification_progress?: boolean | null
          notification_workout?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          units_distance?: string | null
          units_weight?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weight_progress: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          recorded_date: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_date: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_date?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          completed: boolean | null
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string
          duration_minutes: number
          equipment_used: Database["public"]["Enums"]["equipment_type"][] | null
          generated_automatically: boolean | null
          id: string
          intensity_level: number | null
          is_favorite: boolean | null
          is_template: boolean | null
          name: string
          updated_at: string
          user_id: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          equipment_used?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          generated_automatically?: boolean | null
          id?: string
          intensity_level?: number | null
          is_favorite?: boolean | null
          is_template?: boolean | null
          name: string
          updated_at?: string
          user_id: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          equipment_used?:
            | Database["public"]["Enums"]["equipment_type"][]
            | null
          generated_automatically?: boolean | null
          id?: string
          intensity_level?: number | null
          is_favorite?: boolean | null
          is_template?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
          workout_type?: Database["public"]["Enums"]["workout_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_water: {
        Args: { record_id: string; amount: number }
        Returns: undefined
      }
    }
    Enums: {
      achievement_type:
        | "workout_streak"
        | "weight_goal"
        | "hydration_goal"
        | "workout_count"
        | "consistency"
      calendar_event_type:
        | "workout"
        | "meal"
        | "hydration"
        | "weigh_in"
        | "custom"
      equipment_type:
        | "full_gym"
        | "dumbbells"
        | "bodyweight"
        | "resistance_bands"
        | "none"
      experience_level: "beginner" | "intermediate" | "advanced"
      fitness_goal:
        | "lose_weight"
        | "gain_muscle"
        | "maintain_weight"
        | "increase_endurance"
      meal_type:
        | "breakfast"
        | "morning_snack"
        | "lunch"
        | "afternoon_snack"
        | "dinner"
        | "evening_snack"
      workout_type: "strength" | "cardio" | "hiit" | "flexibility"
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
    Enums: {
      achievement_type: [
        "workout_streak",
        "weight_goal",
        "hydration_goal",
        "workout_count",
        "consistency",
      ],
      calendar_event_type: [
        "workout",
        "meal",
        "hydration",
        "weigh_in",
        "custom",
      ],
      equipment_type: [
        "full_gym",
        "dumbbells",
        "bodyweight",
        "resistance_bands",
        "none",
      ],
      experience_level: ["beginner", "intermediate", "advanced"],
      fitness_goal: [
        "lose_weight",
        "gain_muscle",
        "maintain_weight",
        "increase_endurance",
      ],
      meal_type: [
        "breakfast",
        "morning_snack",
        "lunch",
        "afternoon_snack",
        "dinner",
        "evening_snack",
      ],
      workout_type: ["strength", "cardio", "hiit", "flexibility"],
    },
  },
} as const
