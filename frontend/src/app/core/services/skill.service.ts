import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Skill, SkillsByCategory } from '../models';

interface SkillsResponse {
  data: SkillsByCategory;
}

interface SkillResponse {
  data: Skill;
}

interface SkillsListResponse {
  data: Skill[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skills`;
  private adminApiUrl = `${environment.apiUrl}/admin/skills`;

  // Public endpoint
  getSkills(): Observable<SkillsResponse> {
    return this.http.get<SkillsResponse>(this.apiUrl);
  }

  // Admin endpoints
  getAllSkills(page: number = 1, perPage: number = 50): Observable<SkillsListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<SkillsListResponse>(this.adminApiUrl, { params });
  }

  getSkill(id: number): Observable<SkillResponse> {
    return this.http.get<SkillResponse>(`${this.adminApiUrl}/${id}`);
  }

  createSkill(data: Partial<Skill>): Observable<SkillResponse> {
    return this.http.post<SkillResponse>(this.adminApiUrl, data);
  }

  updateSkill(id: number, data: Partial<Skill>): Observable<SkillResponse> {
    return this.http.put<SkillResponse>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
}
