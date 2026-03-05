import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./projects/projects-list.component').then(m => m.ProjectsListComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./projects/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () => import('./projects/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'experiences',
        loadComponent: () => import('./experiences/experiences-list.component').then(m => m.ExperiencesListComponent)
      },
      {
        path: 'experiences/new',
        loadComponent: () => import('./experiences/experience-form.component').then(m => m.ExperienceFormComponent)
      },
      {
        path: 'experiences/:id/edit',
        loadComponent: () => import('./experiences/experience-form.component').then(m => m.ExperienceFormComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./skills/skills-list.component').then(m => m.SkillsListComponent)
      },
      {
        path: 'skills/new',
        loadComponent: () => import('./skills/skill-form.component').then(m => m.SkillFormComponent)
      },
      {
        path: 'skills/:id/edit',
        loadComponent: () => import('./skills/skill-form.component').then(m => m.SkillFormComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./messages/messages-list.component').then(m => m.MessagesListComponent)
      },
      {
        path: 'messages/:id',
        loadComponent: () => import('./messages/message-detail.component').then(m => m.MessageDetailComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
