export interface Skill {
  id: number;
  name: string;
  category: 'Backend' | 'Frontend' | 'Mobile' | 'Database' | 'Tools';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null;
}

export interface SkillsByCategory {
  [category: string]: Skill[];
}
