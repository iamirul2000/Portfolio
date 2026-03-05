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
          <img src="logo.png" alt="MyPortfolio Logo" class="dialog-logo">
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

      @media (max-width: 600px) {
        min-width: 300px;
      }
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 0;

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .dialog-logo {
        width: 48px;
        height: 48px;
        object-fit: contain;
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .close-btn {
        color: #666;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
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
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(244, 67, 54, 0.1);
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 8px;
      color: #d32f2f;
      font-size: 14px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;

      button {
        min-width: 100px;

        &[mat-raised-button] {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: white;

          &:hover:not([disabled]) {
            background: linear-gradient(135deg, #357abd 0%, #2868a8 100%);
          }

          &[disabled] {
            background: #ccc;
            color: #666;
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
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
