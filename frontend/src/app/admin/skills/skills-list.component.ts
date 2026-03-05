import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/skill.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {
  private skillService = inject(SkillService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  skillsByCategory: { [key: string]: Skill[] } = {};
  categories: string[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.skillService.getAllSkills().subscribe({
      next: (response) => {
        // Group skills by category
        const skills = response.data;
        this.skillsByCategory = skills.reduce((acc: { [key: string]: Skill[] }, skill: Skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});
        this.categories = Object.keys(this.skillsByCategory);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load skills', error);
        this.loading = false;
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/admin/skills/new']);
  }

  editSkill(id: number): void {
    this.router.navigate([`/admin/skills/${id}/edit`]);
  }

  deleteSkill(skill: Skill): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Skill',
        message: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.skillService.deleteSkill(skill.id).subscribe({
          next: () => {
            this.loadSkills();
          },
          error: (error) => {
            console.error('Failed to delete skill', error);
          }
        });
      }
    });
  }
}
