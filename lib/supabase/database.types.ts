export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface ProfileRow {
  id: string;
  nickname: string;
  avatar_key: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

export interface OfficeRow {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
  created_at: string;
}

export interface OfficeMemberRow {
  office_id: string;
  user_id: string;
  desk_key: string;
  role: string;
  joined_at: string;
}

export interface CurrentStatusRow {
  office_id: string;
  user_id: string;
  status: string;
  message: string;
  mood: string;
  started_at: string;
  updated_at: string;
}

export interface CheckinRow {
  id: string;
  office_id: string;
  user_id: string;
  status: string;
  message: string;
  mood: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface InteractionRow {
  id: string;
  office_id: string;
  sender_id: string;
  receiver_id: string;
  interaction_type: string;
  payload: Json;
  created_at: string;
  read_at: string | null;
}

export interface CommentRow {
  id: string;
  office_id: string;
  checkin_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow, {
        id: string;
        nickname: string;
        avatar_key?: string;
        accent_color?: string;
        created_at?: string;
        updated_at?: string;
      }, Partial<Omit<ProfileRow, "id" | "created_at">>>;
      offices: Table<OfficeRow, {
        id?: string;
        name: string;
        invite_code: string;
        owner_id: string;
        created_at?: string;
      }, Partial<Omit<OfficeRow, "id" | "created_at">>>;
      office_members: Table<OfficeMemberRow, {
        office_id: string;
        user_id: string;
        desk_key: string;
        role?: string;
        joined_at?: string;
      }, Partial<Omit<OfficeMemberRow, "office_id" | "user_id" | "joined_at">>>;
      current_status: Table<CurrentStatusRow, {
        office_id: string;
        user_id: string;
        status: string;
        message?: string;
        mood?: string;
        started_at?: string;
        updated_at?: string;
      }, Partial<Omit<CurrentStatusRow, "office_id" | "user_id">>>;
      checkins: Table<CheckinRow, {
        id?: string;
        office_id: string;
        user_id: string;
        status: string;
        message?: string;
        mood?: string;
        started_at: string;
        ended_at?: string | null;
        created_at?: string;
      }, Partial<Omit<CheckinRow, "id" | "office_id" | "user_id" | "created_at">>>;
      interactions: Table<InteractionRow, {
        id?: string;
        office_id: string;
        sender_id: string;
        receiver_id: string;
        interaction_type: string;
        payload?: Json;
        created_at?: string;
        read_at?: string | null;
      }, { read_at?: string | null }>;
      comments: Table<CommentRow, {
        id?: string;
        office_id: string;
        checkin_id: string;
        sender_id: string;
        content: string;
        created_at?: string;
      }, never>;
    };
    Views: Record<string, never>;
    Functions: {
      create_office: {
        Args: { p_name: string };
        Returns: Array<{ office_id: string; office_name: string; invite_code: string; desk_key: string }>;
      };
      preview_office_by_invite_code: {
        Args: { p_invite_code: string };
        Returns: Array<{ office_id: string; office_name: string; current_member_count: number; available_desks: string[] }>;
      };
      join_office: {
        Args: { p_invite_code: string; p_desk_key: string };
        Returns: Array<{ office_id: string; office_name: string; invite_code: string; desk_key: string }>;
      };
      set_current_status: {
        Args: { p_office_id: string; p_status: string; p_message?: string; p_mood?: string };
        Returns: CurrentStatusRow[];
      };
      send_interaction: {
        Args: { p_office_id: string; p_receiver_id: string; p_interaction_type: string; p_payload?: Json };
        Returns: InteractionRow[];
      };
      mark_interaction_read: {
        Args: { p_interaction_id: string };
        Returns: string;
      };
      get_my_office_info: {
        Args: Record<string, never>;
        Returns: Array<{
          office_id: string;
          office_name: string;
          invite_code: string;
          owner_id: string;
          current_user_role: string;
          current_user_desk_key: string;
          member_count: number;
        }>;
      };
      leave_office: { Args: Record<string, never>; Returns: boolean };
      transfer_office_ownership: { Args: { p_new_owner_id: string }; Returns: boolean };
      delete_my_office: { Args: Record<string, never>; Returns: boolean };
      is_office_member: { Args: { target_office_id: string }; Returns: boolean };
      shares_office_with: { Args: { target_user_id: string }; Returns: boolean };
      is_office_owner: { Args: { target_office_id: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
