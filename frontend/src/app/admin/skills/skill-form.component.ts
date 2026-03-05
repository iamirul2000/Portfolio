import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SkillService } from '../../core/services/skill.service';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private skillService = inject(SkillService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  skillForm!: FormGroup;
  loading = false;
  isEditMode = false;
  skillId: number | null = null;

  categories = ['Backend', 'Frontend', 'Mobile', 'Database', 'Tools'];
  levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.skillId = +id;
      this.loadSkill(this.skillId);
    }
  }

  initForm(): void {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      category: ['', Validators.required],
      level: ['']
    });
  }

  loadSkill(id: number): void {
    this.loading = true;
    this.skillService.getSkill(id).subscribe({
      next: (response) => {
        const skill = response.data;
        this.skillForm.patchValue({
          name: skill.name,
          category: skill.category,
          level: skill.level || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load skill', error);
        this.loading = false;
        this.router.navigate(['/admin/skills']);
      }
    });
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data = {
      ...this.skillForm.value,
      level: this.skillForm.value.level || null
    };

    const request = this.isEditMode && this.skillId
      ? this.skillService.updateSkill(this.skillId, data)
      : this.skillService.createSkill(data);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/skills']);
      },
      error: (error) => {
        console.error('Failed to save skill', error);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/skills']);
  }
}
