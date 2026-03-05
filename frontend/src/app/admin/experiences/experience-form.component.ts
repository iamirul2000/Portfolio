import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ExperienceService } from '../../core/services/experience.service';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss']
})
export class ExperienceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  experienceForm!: FormGroup;
  loading = false;
  isEditMode = false;
  experienceId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.experienceId = +id;
      this.loadExperience(this.experienceId);
    }

    // Watch is_current checkbox
    this.experienceForm.get('is_current')?.valueChanges.subscribe(isCurrent => {
      const endDateControl = this.experienceForm.get('end_date');
      if (isCurrent) {
        endDateControl?.clearValidators();
        endDateControl?.setValue(null);
        endDateControl?.disable();
      } else {
        endDateControl?.setValidators([Validators.required]);
        endDateControl?.enable();
      }
      endDateControl?.updateValueAndValidity();
    });
  }

  initForm(): void {
    this.experienceForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.maxLength(255)]],
      role_title: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      company_domain: ['', [Validators.maxLength(255)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_current: [false],
      summary: ['', Validators.required],
      highlights: this.fb.array([this.createHighlight()]),
      technologies: this.fb.array([this.createTechnology()])
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
    return this.experienceForm.get('highlights') as FormArray;
  }

  get technologies(): FormArray {
    return this.experienceForm.get('technologies') as FormArray;
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

  loadExperience(id: number): void {
    this.loading = true;
    this.experienceService.getExperience(id).subscribe({
      next: (response) => {
        const experience = response.data;
        
        // Clear existing arrays
        while (this.highlights.length) {
          this.highlights.removeAt(0);
        }
        while (this.technologies.length) {
          this.technologies.removeAt(0);
        }

        // Populate arrays
        experience.highlights.forEach(h => {
          this.highlights.push(this.fb.group({ value: [h, Validators.required] }));
        });
        experience.technologies.forEach(t => {
          this.technologies.push(this.fb.group({ value: [t, Validators.required] }));
        });

        // Set form values
        this.experienceForm.patchValue({
          company_name: experience.company_name,
          role_title: experience.role_title,
          location: experience.location,
          company_domain: experience.company_domain,
          start_date: new Date(experience.start_date),
          end_date: experience.end_date ? new Date(experience.end_date) : null,
          is_current: experience.is_current,
          summary: experience.summary
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load experience', error);
        this.loading = false;
        this.router.navigate(['/admin/experiences']);
      }
    });
  }

  onSubmit(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data = this.prepareData();

    const request = this.isEditMode && this.experienceId
      ? this.experienceService.updateExperience(this.experienceId, data)
      : this.experienceService.createExperience(data);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/experiences']);
      },
      error: (error) => {
        console.error('Failed to save experience', error);
        this.loading = false;
      }
    });
  }

  prepareData(): any {
    const formValue = this.experienceForm.getRawValue();
    
    return {
      company_name: formValue.company_name,
      role_title: formValue.role_title,
      location: formValue.location,
      company_domain: formValue.company_domain || null,
      start_date: this.formatDate(formValue.start_date),
      end_date: formValue.is_current ? null : this.formatDate(formValue.end_date),
      is_current: formValue.is_current,
      summary: formValue.summary,
      highlights: this.highlights.controls.map(c => c.value.value),
      technologies: this.technologies.controls.map(c => c.value.value)
    };
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/admin/experiences']);
  }
}
