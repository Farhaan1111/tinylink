// types/link.ts
export interface Link {
  id: number;
  code: string;
  original_url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
}

export interface CreateLinkRequest {
  url: string;
  customCode?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: Link;
  error?: string;
}