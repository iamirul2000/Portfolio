export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  role: string;
  start_date: string;
  end_date: string;
  highlights: string[];
  technologies: string[];
  repo_url: string | null;
  live_url: string | null;
  thumbnail_url: string;
  is_featured: boolean;
}
