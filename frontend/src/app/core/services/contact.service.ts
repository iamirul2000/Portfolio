import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessage, ContactFormData } from '../models';

interface ContactResponse {
  data: {
    message: string;
  };
}

interface ContactMessagesResponse {
  data: ContactMessage[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ContactMessageResponse {
  data: ContactMessage;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;
  private adminApiUrl = `${environment.apiUrl}/admin/contact-messages`;

  // Public endpoint
  submitContactForm(data: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, data);
  }

  // Admin endpoints
  getMessages(status?: 'new' | 'read' | 'all', page: number = 1): Observable<ContactMessagesResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get<ContactMessagesResponse>(this.adminApiUrl, { params });
  }

  getMessage(id: number): Observable<ContactMessageResponse> {
    return this.http.get<ContactMessageResponse>(`${this.adminApiUrl}/${id}`);
  }

  updateMessageStatus(id: number, status: 'new' | 'read'): Observable<ContactMessageResponse> {
    return this.http.patch<ContactMessageResponse>(
      `${this.adminApiUrl}/${id}/status`,
      { status }
    );
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
}
