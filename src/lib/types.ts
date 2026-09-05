export type UserRole = "student" | "exec" | "admin";
export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "waitlisted"
  | "accepted"
  | "declined"
  | "withdrawn";
export type TeamStatus = "forming" | "active" | "behind" | "inactive" | "completed";
export type ProposalStatus = "draft" | "submitted" | "changes_requested" | "approved";
export type EventKind =
  | "workshop"
  | "talk"
  | "mentor_session"
  | "networking"
  | "career"
  | "demo_day"
  | "other";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  program: string | null;
  year: string | null;
  github_url: string | null;
  role: UserRole;
  created_at: string;
};

export type Application = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  program: string;
  year: string;
  skills: string;
  interest_areas: string;
  github_url: string | null;
  previous_projects: string | null;
  applying_with_team: boolean;
  teammates: string | null;
  has_project_idea: boolean;
  project_idea: string | null;
  weekly_hours: string;
  goals: string;
  status: ApplicationStatus;
  reviewer_notes: string | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string | null;
  mvp_definition: string | null;
  communication_channel: string | null;
  exec_contact_name: string | null;
  exec_contact_email: string | null;
  status: TeamStatus;
  showcased: boolean;
  demo_day_slot: string | null;
  created_at: string;
};

export type TeamMember = {
  team_id: string;
  user_id: string;
  role_on_team: string | null;
  is_lead: boolean;
};

export type Proposal = {
  id: string;
  team_id: string;
  problem: string;
  solution: string;
  target_user: string;
  mvp_scope: string;
  out_of_scope: string | null;
  tech_stack: string;
  team_roles: string;
  milestones: string;
  status: ProposalStatus;
  feedback: string | null;
  submitted_at: string | null;
  updated_at: string;
};

export type CheckIn = {
  id: string;
  team_id: string;
  submitted_by: string | null;
  cycle: number;
  completed: string;
  in_progress: string;
  next_up: string;
  behind_schedule: boolean;
  blockers: string | null;
  help_needed: string | null;
  created_at: string;
};

export type IncubatorEvent = {
  id: string;
  title: string;
  slug: string;
  kind: EventKind;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  host: string | null;
  rsvp_url: string | null;
  published: boolean;
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  sort_order: number;
  published: boolean;
};

/**
 * Database type in the shape supabase-js expects: every table declares Row,
 * Insert, Update, and Relationships.
 *
 * Once the schema settles, replace this file's Database type with generated
 * output so it can never drift from the real database:
 *   supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 */

type Timestamps = "created_at" | "updated_at";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "role"> & { role?: UserRole; created_at?: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, "id" | Timestamps | "status" | "reviewer_notes" | "team_id"> & {
          id?: string;
          status?: ApplicationStatus;
          reviewer_notes?: string | null;
          team_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Application>;
        Relationships: [];
      };
      teams: {
        Row: Team;
        Insert: Partial<Omit<Team, "name" | "slug">> & { name: string; slug: string };
        Update: Partial<Team>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, "is_lead" | "role_on_team"> & {
          is_lead?: boolean;
          role_on_team?: string | null;
        };
        Update: Partial<TeamMember>;
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      proposals: {
        Row: Proposal;
        Insert: Partial<Omit<Proposal, "team_id">> & { team_id: string };
        Update: Partial<Proposal>;
        Relationships: [
          {
            foreignKeyName: "proposals_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: true;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      check_ins: {
        Row: CheckIn;
        Insert: Partial<Omit<CheckIn, "team_id" | "cycle">> & { team_id: string; cycle: number };
        Update: Partial<CheckIn>;
        Relationships: [
          {
            foreignKeyName: "check_ins_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: IncubatorEvent;
        Insert: Partial<Omit<IncubatorEvent, "title" | "slug" | "starts_at">> & {
          title: string;
          slug: string;
          starts_at: string;
        };
        Update: Partial<IncubatorEvent>;
        Relationships: [];
      };
      event_rsvps: {
        Row: { event_id: string; user_id: string; created_at: string };
        Insert: { event_id: string; user_id: string; created_at?: string };
        Update: Partial<{ event_id: string; user_id: string; created_at: string }>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Partial<Omit<Resource, "title" | "url">> & { title: string; url: string };
        Update: Partial<Resource>;
        Relationships: [];
      };
      program_settings: {
        Row: { key: string; value: string; updated_at: string };
        Insert: { key: string; value: string; updated_at?: string };
        Update: Partial<{ key: string; value: string; updated_at: string }>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      get_project_members: {
        Args: { project_team: string };
        Returns: {
          full_name: string | null;
          github_url: string | null;
          role_on_team: string | null;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      application_status: ApplicationStatus;
      team_status: TeamStatus;
      proposal_status: ProposalStatus;
      event_kind: EventKind;
    };
    CompositeTypes: Record<never, never>;
  };
};
