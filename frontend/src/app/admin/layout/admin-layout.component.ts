import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatListModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <div class="admin-layout">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <button mat-icon-button class="menu-toggle" (click)="drawer.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        
        <div class="nav-content">
          <div class="page-info">
            <img src="logo.png" alt="MyPortfolio Logo" class="admin-logo">
            <h1 class="page-title">MyPortfolio Admin</h1>
          </div>
          
          <div class="nav-actions">
            <button mat-icon-button class="action-btn" matTooltip="Notifications">
              <mat-icon>notifications_none</mat-icon>
            </button>
            
            <button mat-button class="profile-btn" [matMenuTriggerFor]="profileMenu">
              <div class="avatar">AI</div>
              <span class="profile-name">Admin</span>
              <mat-icon>expand_more</mat-icon>
            </button>
            
            <mat-menu #profileMenu="matMenu" class="profile-menu">
              <button mat-menu-item routerLink="/" target="_blank">
                <mat-icon>open_in_new</mat-icon>
                <span>View Portfolio</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </header>

      <!-- Sidebar + Content -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer mode="side" opened class="sidenav">
          <div class="sidebar-content">
            <nav class="nav-menu">
              <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </a>
              
              <div class="nav-group">
                <div class="nav-group-label">Content</div>
                <a mat-list-item routerLink="/admin/projects" routerLinkActive="active" class="nav-item">
                  <mat-icon>work_outline</mat-icon>
                  <span>Projects</span>
                </a>
                <a mat-list-item routerLink="/admin/experiences" routerLinkActive="active" class="nav-item">
                  <mat-icon>business_center</mat-icon>
                  <span>Experiences</span>
                </a>
                <a mat-list-item routerLink="/admin/skills" routerLinkActive="active" class="nav-item">
                  <mat-icon>code</mat-icon>
                  <span>Skills</span>
                </a>
              </div>
              
              <div class="nav-group">
                <div class="nav-group-label">Communication</div>
                <a mat-list-item routerLink="/admin/messages" routerLinkActive="active" class="nav-item">
                  <mat-icon>mail_outline</mat-icon>
                  <span>Messages</span>
                </a>
              </div>
            </nav>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
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
      background: #0a0e1a;
      color: #e4e7eb;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Top Navigation */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 16px;
    }

    .menu-toggle {
      color: #94a3b8;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #e4e7eb;
      }
    }

    .nav-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .admin-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: #f1f5f9;
      letter-spacing: -0.01em;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      color: #94a3b8;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #e4e7eb;
      }
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px;
      border-radius: 12px;
      color: #e4e7eb;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: white;
      }

      .profile-name {
        font-size: 14px;
        font-weight: 500;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #64748b;
      }
    }

    /* Sidebar Container */
    .sidenav-container {
      flex: 1;
      background: #0a0e1a;
    }

    .sidenav {
      width: 240px;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      padding: 16px 0;
    }

    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .nav-menu {
      flex: 1;
      padding: 0 12px;
    }

    .nav-group {
      margin-top: 24px;
    }

    .nav-group-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      padding: 0 12px 8px;
    }

    .nav-item {
      display: flex !important;
      align-items: center !important;
      gap: 12px;
      padding: 10px 12px !important;
      margin-bottom: 4px;
      border-radius: 12px;
      color: #94a3b8;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      height: 44px !important;
      min-height: 44px !important;

      mat-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        line-height: 20px !important;
        color: #64748b;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      span {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        display: flex;
        align-items: center;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #e4e7eb;

        mat-icon {
          color: #94a3b8;
        }
      }

      &.active {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;

        mat-icon {
          color: #3b82f6;
        }
      }
    }

    /* Override Material List Item styles */
    ::ng-deep {
      .nav-item.mat-mdc-list-item {
        .mdc-list-item__content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0;
        }

        .mat-mdc-list-item-unscoped-content {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
      }
    }

    /* Main Content */
    .main-content {
      background: #0a0e1a;
      min-height: 100%;
      padding: 24px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }

      .profile-name {
        display: none;
      }

      .main-content {
        padding: 16px;
      }
    }

    /* Material Overrides */
    ::ng-deep {
      .profile-menu {
        .mat-mdc-menu-panel {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          margin-top: 8px;
        }

        .mat-mdc-menu-item {
          color: #e4e7eb;
          
          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          mat-icon {
            color: #64748b;
            margin-right: 12px;
          }
        }

        .mat-divider {
          border-top-color: rgba(255, 255, 255, 0.06);
        }
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
