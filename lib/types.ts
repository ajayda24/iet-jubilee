export interface Caption {
  id: string;
  caption_text: string;
  author_name: string;
  department: string;
  like_count: number;
  created_at: string;
  user_id: string;
}

export interface Like {
  id: string;
  caption_id: string;
  user_id: string;
  created_at: string;
}

export const DEPARTMENTS = [
  { value: "IT", label: "Information Technology" },
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "EC", label: "Electronics & Communication" },
  { value: "EEE", label: "Electrical & Electronics Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "EP", label: "Engineering Physics" },
  { value: "PT", label: "Production Technology" },
] as const;
export const YEARS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
] as const;

export type Department = (typeof DEPARTMENTS)[number]["value"];
export type Year = (typeof YEARS)[number]["value"];
