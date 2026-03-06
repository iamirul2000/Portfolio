import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectForm!: FormGroup;
  loading = false;
  isEditMode = false;
  projectId: number | null = null;
  thumbnailPreview: string | null = null;
  selectedFile: File | null = null;
  isCurrentProject = false;

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.projectId = +id;
      this.loadProject(this.projectId);
    }
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      slug: ['', [Validators.maxLength(255)]],
      description: ['', Validators.required],
      role: ['', [Validators.required, Validators.maxLength(255)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      highlights: this.fb.array([this.createHighlight()]),
      technologies: this.fb.array([this.createTechnology()]),
      repo_url: ['', [Validators.maxLength(500)]],
      live_url: ['', [Validators.maxLength(500)]],
      is_featured: [false]
    });
  }

  createHighlight(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  createTechnology(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  get highlights(): FormArray {
    return this.projectForm.get('highlights') as FormArray;
  }

  get technologies(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  addHighlight(): void {
    this.highlights.push(this.createHighlight());
  }

  removeHighlight(index: number): void {
    if (this.highlights.length > 1) {
      this.highlights.removeAt(index);
    }
  }

  addTechnology(): void {
    this.technologies.push(this.createTechnology());
  }

  removeTechnology(index: number): void {
    if (this.technologies.length > 1) {
      this.technologies.removeAt(index);
    }
  }

  onCurrentProjectChange(): void {
    const endDateControl = this.projectForm.get('end_date');
    if (this.isCurrentProject) {
      endDateControl?.clearValidators();
      endDateControl?.setValue(null);
    } else {
      endDateControl?.setValidators([Validators.required]);
    }
    endDateControl?.updateValueAndValidity();
  }

  loadProject(id: number): void {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (response) => {
        const project = response.data;
        
        // Clear existing arrays
        while (this.highlights.length) {
          this.highlights.removeAt(0);
        }
        while (this.technologies.length) {
          this.technologies.removeAt(0);
        }

        // Populate arrays
        project.highlights.forEach(h => {
          this.highlights.push(this.fb.group({ value: [h, Validators.required] }));
        });
        project.technologies.forEach(t => {
          this.technologies.push(this.fb.group({ value: [t, Validators.required] }));
        });

        // Set form values
        this.projectForm.patchValue({
          title: project.title,
          slug: project.slug,
          description: project.description,
          role: project.role,
          start_date: new Date(project.start_date),
          end_date: project.end_date ? new Date(project.end_date) : null,
          repo_url: project.repo_url,
          live_url: project.live_url,
          is_featured: project.is_featured
        });

        // Check if it's a current project (no end date)
        this.isCurrentProject = !project.end_date;
        if (this.isCurrentProject) {
          this.projectForm.get('end_date')?.clearValidators();
          this.projectForm.get('end_date')?.updateValueAndValidity();
        }

        this.thumbnailPreview = project.thumbnail_url;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load project', error);
        this.loading = false;
        this.router.navigate(['/admin/projects']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.prepareFormData();

    const request = this.isEditMode && this.projectId
      ? this.projectService.updateProject(this.projectId, formData)
      : this.projectService.createProject(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/projects']);
      },
      error: (error) => {
        console.error('Failed to save project', error);
        this.loading = false;
      }
    });
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.projectForm.value;

    formData.append('title', formValue.title);
    if (formValue.slug) {
      formData.append('slug', formValue.slug);
    }
    formData.append('description', formValue.description);
    formData.append('role', formValue.role);
    formData.append('start_date', this.formatDate(formValue.start_date));
    
    // Only add end_date if not a current project
    if (!this.isCurrentProject && formValue.end_date) {
      formData.append('end_date', this.formatDate(formValue.end_date));
    }
    
    const highlights = this.highlights.controls.map(c => c.value.value);
    formData.append('highlights', JSON.stringify(highlights));
    
    const technologies = this.technologies.controls.map(c => c.value.value);
    formData.append('technologies', JSON.stringify(technologies));
    
    if (formValue.repo_url) {
      formData.append('repo_url', formValue.repo_url);
    }
    if (formValue.live_url) {
      formData.append('live_url', formValue.live_url);
    }
    formData.append('is_featured', formValue.is_featured ? '1' : '0');

    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    return formData;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/admin/projects']);
  }
}
