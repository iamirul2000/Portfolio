import { Project } from './project.model';

export interface Profile {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  featured_projects: Project[];
  skills_summary: {
    [category: string]: string[];
  };
}
