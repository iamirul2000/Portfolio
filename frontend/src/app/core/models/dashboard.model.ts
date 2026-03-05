import { ContactMessage } from './contact-message.model';

export interface DashboardStats {
  projects_count: number;
  experiences_count: number;
  skills_count: number;
  unread_messages_count: number;
  recent_messages: ContactMessage[];
}
