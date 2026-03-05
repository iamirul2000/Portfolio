import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="admin-layout">
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button (click)="drawer.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="title">Portfolio Admin</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/admin/projects" routerLinkActive="active">
              <mat-icon>work</mat-icon>
              <span>Projects</span>
            </a>
            <a mat-list-item routerLink="/admin/experiences" routerLinkActive="active">
              <mat-icon>business_center</mat-icon>
              <span>Experiences</span>
            </a>
            <a mat-list-item routerLink="/admin/skills" routerLinkActive="active">
              <mat-icon>code</mat-icon>
              <span>Skills</span>
            </a>
            <a mat-list-item routerLink="/admin/messages" routerLinkActive="active">
              <mat-icon>email</mat-icon>
              <span>Messages</span>
            </a>
            <mat-divider></mat-divider>
            <a mat-list-item routerLink="/" target="_blank">
              <mat-icon>open_in_new</mat-icon>
              <span>View Portfolio</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;

      .title {
        font-size: 20px;
        font-weight: 500;
      }

      .spacer {
        flex: 1;
      }

      button mat-icon {
        margin-right: 8px;
      }
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
      padding-top: 16px;

      mat-nav-list {
        a {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;

          &.active {
            background-color: rgba(103, 126, 234, 0.1);
            color: #667eea;

            mat-icon {
              color: #667eea;
            }
          }

          mat-icon {
            color: #666;
          }

          span {
            font-size: 14px;
          }
        }
      }

      mat-divider {
        margin: 16px 0;
      }
    }

    mat-sidenav-content {
      background-color: #f5f5f5;
      min-height: 100%;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
