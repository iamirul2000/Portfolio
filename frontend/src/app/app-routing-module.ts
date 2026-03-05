import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { About } from './about/about';
import { Experience } from './experience/experience';
import { Projects } from './projects/projects';
import { ProjectDetail } from './project-detail/project-detail';
import { Skills } from './skills/skills';
import { Contact } from './contact/contact';

const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'experience', component: Experience },
  { path: 'projects', component: Projects },
  { path: 'projects/:slug', component: ProjectDetail },
  { path: 'skills', component: Skills },
  { path: 'contact', component: Contact },
  
  // Admin routes (lazy-loaded)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
