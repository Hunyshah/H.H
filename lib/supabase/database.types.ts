// Supabase database types.
// Regenerate after every migration with `pnpm db:types` (see README).
// Matches the live project's generated types (tables, enums); helper types simplified.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Lets createClient infer the PostgREST version.
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admins: {
        Row: { user_id: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      leads: {
        Row: {
          budget: string | null;
          created_at: string;
          id: string;
          location: string | null;
          message: string | null;
          name: string;
          notes: string | null;
          phone: string;
          plot_size: string | null;
          project_type: string | null;
          referrer: string | null;
          source: string;
          status: Database["public"]["Enums"]["lead_status"];
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          budget?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          message?: string | null;
          name: string;
          notes?: string | null;
          phone: string;
          plot_size?: string | null;
          project_type?: string | null;
          referrer?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          budget?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          message?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string;
          plot_size?: string | null;
          project_type?: string | null;
          referrer?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      project_media: {
        Row: {
          alt: string | null;
          caption: string | null;
          id: string;
          phase: Database["public"]["Enums"]["media_phase"];
          project_id: string;
          sort_order: number;
          storage_path: string | null;
          type: Database["public"]["Enums"]["media_type"];
          video_url: string | null;
        };
        Insert: {
          alt?: string | null;
          caption?: string | null;
          id?: string;
          phase?: Database["public"]["Enums"]["media_phase"];
          project_id: string;
          sort_order?: number;
          storage_path?: string | null;
          type: Database["public"]["Enums"]["media_type"];
          video_url?: string | null;
        };
        Update: {
          alt?: string | null;
          caption?: string | null;
          id?: string;
          phase?: Database["public"]["Enums"]["media_phase"];
          project_id?: string;
          sort_order?: number;
          storage_path?: string | null;
          type?: Database["public"]["Enums"]["media_type"];
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          category: Database["public"]["Enums"]["project_category"];
          cover_image_path: string | null;
          covered_area_sqft: number | null;
          created_at: string;
          floors: number | null;
          hero_video_url: string | null;
          id: string;
          is_featured: boolean;
          is_published: boolean;
          location: string | null;
          plot_size: string | null;
          scope: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["project_status"];
          story: string | null;
          summary: string | null;
          title: string;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          category: Database["public"]["Enums"]["project_category"];
          cover_image_path?: string | null;
          covered_area_sqft?: number | null;
          created_at?: string;
          floors?: number | null;
          hero_video_url?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          location?: string | null;
          plot_size?: string | null;
          scope?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["project_status"];
          story?: string | null;
          summary?: string | null;
          title: string;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          category?: Database["public"]["Enums"]["project_category"];
          cover_image_path?: string | null;
          covered_area_sqft?: number | null;
          created_at?: string;
          floors?: number | null;
          hero_video_url?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          location?: string | null;
          plot_size?: string | null;
          scope?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["project_status"];
          story?: string | null;
          summary?: string | null;
          title?: string;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          body: string | null;
          faq: Json;
          id: string;
          short: string | null;
          slug: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          body?: string | null;
          faq?: Json;
          id?: string;
          short?: string | null;
          slug: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          body?: string | null;
          faq?: Json;
          id?: string;
          short?: string | null;
          slug?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address: string | null;
          email: string | null;
          id: number;
          map_embed_url: string | null;
          phone: string | null;
          socials: Json | null;
          stats: Json | null;
          whatsapp: string | null;
        };
        Insert: {
          address?: string | null;
          email?: string | null;
          id?: number;
          map_embed_url?: string | null;
          phone?: string | null;
          socials?: Json | null;
          stats?: Json | null;
          whatsapp?: string | null;
        };
        Update: {
          address?: string | null;
          email?: string | null;
          id?: number;
          map_embed_url?: string | null;
          phone?: string | null;
          socials?: Json | null;
          stats?: Json | null;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          client_name: string;
          id: string;
          is_published: boolean;
          project_id: string | null;
          quote: string | null;
          rating: number | null;
          video_url: string | null;
        };
        Insert: {
          client_name: string;
          id?: string;
          is_published?: boolean;
          project_id?: string | null;
          quote?: string | null;
          rating?: number | null;
          video_url?: string | null;
        };
        Update: {
          client_name?: string;
          id?: string;
          is_published?: boolean;
          project_id?: string | null;
          quote?: string | null;
          rating?: number | null;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      lead_status: "new" | "contacted" | "site_visit" | "quoted" | "won" | "lost";
      media_phase: "before" | "progress" | "after";
      media_type: "image" | "video";
      project_category: "residential" | "commercial" | "industrial" | "civil";
      project_status: "completed" | "ongoing";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

export const Constants = {
  public: {
    Enums: {
      lead_status: ["new", "contacted", "site_visit", "quoted", "won", "lost"],
      media_phase: ["before", "progress", "after"],
      media_type: ["image", "video"],
      project_category: ["residential", "commercial", "industrial", "civil"],
      project_status: ["completed", "ongoing"],
    },
  },
} as const;
