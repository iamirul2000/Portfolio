import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models';

interface ProjectsResponse {
  data: Project[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ProjectResponse {
  data: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;
  private adminApiUrl = `${environment.apiUrl}/admin/projects`;

  // Public endpoints
  getProjects(featured?: boolean, page: number = 1): Observable<ProjectsResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (featured !== undefined) {
      params = params.set('featured', featured.toString());
    }
    return this.http.get<ProjectsResponse>(this.apiUrl, { params });
  }

  getProjectBySlug(slug: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${slug}`);
  }

  // Admin endpoints
  getAllProjects(page: number = 1, perPage: number = 15): Observable<ProjectsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<ProjectsResponse>(this.adminApiUrl, { params });
  }

  getProject(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.adminApiUrl}/${id}`);
  }

  createProject(formData: FormData): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.adminApiUrl, formData);
  }

  updateProject(id: number, formData: FormData): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.adminApiUrl}/${id}?_method=PUT`, formData);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }
}
