import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="login-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <img src="portfolio.png" alt="MyPortfolio Logo" class="dialog-logo">
          <h2 mat-dialog-title>MyPortfolio Admin</h2>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-dialog-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="admin@example.com" autocomplete="email">
            @if (email?.invalid && email?.touched) {
              <mat-error>
                @if (email?.errors?.['required']) {
                  Email is required
                }
                @if (email?.errors?.['email']) {
                  Please enter a valid email
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter password" autocomplete="current-password">
            @if (password?.invalid && password?.touched) {
              <mat-error>
                @if (password?.errors?.['required']) {
                  Password is required
                }
                @if (password?.errors?.['minlength']) {
                  Password must be at least 6 characters
                }
              </mat-error>
            }
          </mat-form-field>

          @if (errorMessage) {
            <div class="error-message">
              <mat-icon>error_outline</mat-icon>
              {{ errorMessage }}
            </div>
          }

          <div class="dialog-actions">
            <button mat-button type="button" (click)="close()">Cancel</button>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="loading || loginForm.invalid">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
                Logging in...
              } @else {
                Login
              }
            </button>
          </div>
        </form>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .login-dialog {
      min-width: 400px;
      max-width: 500px;
      position: relative;
      overflow: hidden;

      @media (max-width: 600px) {
        min-width: 300px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
        animation: gradient-shift 3s ease infinite;
        background-size: 200% 200%;
      }

      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      position: relative;

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .dialog-logo {
        width: 64px;
        height: 64px;
        object-fit: contain;
        flex-shrink: 0;
        animation: float 3s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 3s ease infinite;
        background-size: 200% 200%;
      }

      .close-btn {
        color: var(--color-text-muted);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          transform: rotate(90deg);
        }
      }
    }

    mat-dialog-content {
      padding: 24px;
      overflow: visible;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;

      ::ng-deep {
        .mat-mdc-text-field-wrapper {
          transition: all 0.3s ease;
        }

        .mat-mdc-form-field-focus-overlay {
          background-color: rgba(59, 130, 246, 0.05);
        }

        .mdc-text-field--focused {
          .mdc-notched-outline {
            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: #3b82f6 !important;
              border-width: 2px !important;
            }
          }
        }

        .mat-mdc-form-field-icon-prefix,
        .mat-mdc-form-field-icon-suffix {
          color: var(--color-primary);
        }

        input {
          caret-color: var(--color-primary);
        }
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #ef4444;
      font-size: 14px;
      animation: shake 0.5s ease;

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;

      button {
        min-width: 100px;
        transition: all 0.3s ease;

        &[mat-button] {
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        &[mat-raised-button] {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }

          &:hover:not([disabled]) {
            background: linear-gradient(135deg, #8b5cf6, #ec4899) !important;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
            transform: translateY(-2px);

            &::before {
              width: 300px;
              height: 300px;
            }
          }

          &:active:not([disabled]) {
            transform: translateY(0);
          }

          &[disabled] {
            background: rgba(0, 0, 0, 0.12) !important;
            color: rgba(0, 0, 0, 0.26);
            box-shadow: none;
          }

          mat-spinner {
            display: inline-block;
            margin-right: 8px;

            ::ng-deep circle {
              stroke: white;
            }
          }
        }
      }
    }

    ::ng-deep {
      .mat-mdc-dialog-container {
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        background: var(--color-surface);
        overflow: hidden;
      }

      .login-dialog-backdrop {
        backdrop-filter: blur(8px);
        background: rgba(0, 0, 0, 0.6);
      }
    }
  `]
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error?.message || 'Invalid credentials. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
