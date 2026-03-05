import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience } from '../models';

interface ExperiencesResponse {
  data: Experience[];
}

interface ExperienceResponse {
  data: Experience;
}

interface PaginatedExperiencesResponse {
  data: Experience[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/experiences`;
  private adminApiUrl = `${environment.apiUrl}/admin/experiences`;

  // Public endpoint
  getExperiences(): Observable<ExperiencesResponse> {
    return this.http.get<ExperiencesResponse>(this.apiUrl);
  }

  // Admin endpoints
  getAllExperiences(page: number = 1, perPage: number = 15): Observable<PaginatedExperiencesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<PaginatedExperiencesResponse>(this.adminApiUrl, { params });
  }

  getExperience(id: number): Observable<ExperienceResponse> {
    return this.http.get<ExperienceResponse>(`${this.adminApiUrl}/${id}`);
  }

  createExperience(data: Partial<Experience>): Observable<ExperienceResponse> {
    return this.http.post<ExperienceResponse>(this.adminApiUrl, data);
  }

  updateExperience(id: number, data: Partial<Experience>): Observable<ExperienceResponse> {
    return this.http.put<ExperienceResponse>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
}
