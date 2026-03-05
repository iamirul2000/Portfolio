export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
