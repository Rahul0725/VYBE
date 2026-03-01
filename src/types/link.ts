export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon?: string;
  position: number;
  is_active: boolean;
  click_count: number;
  show_clicks?: boolean;
  start_date?: string;
  end_date?: string;
  animation?: string;
  created_at: string;
}
