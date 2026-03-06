import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: Project;
  
  imageLoading = true;
  imageError = false;

  // Placeholder images that rotate through projects
  private placeholderImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Analytics dashboard
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop', // Mobile POS
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'  // Payment app
  ];

  getProjectImage(): string {
    // If there's a valid thumbnail_url and no error, use it
    if (this.project.thumbnail_url && !this.imageError) {
      return this.project.thumbnail_url;
    }
    
    // Otherwise, use a placeholder based on project ID
    const index = this.project.id % this.placeholderImages.length;
    return this.placeholderImages[index];
  }

  onImageLoad(): void {
    this.imageLoading = false;
  }

  onImageError(event: Event): void {
    this.imageError = true;
    this.imageLoading = false;
    // Force re-render by updating the src
    const img = event.target as HTMLImageElement;
    const index = this.project.id % this.placeholderImages.length;
    img.src = this.placeholderImages[index];
  }
}

