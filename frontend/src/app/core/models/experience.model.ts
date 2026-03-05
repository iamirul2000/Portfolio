export interface Experience {
  id: number;
  company_name: string;
  role_title: string;
  location: string;
  company_domain: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  summary: string;
  highlights: string[];
  technologies: string[];
}
