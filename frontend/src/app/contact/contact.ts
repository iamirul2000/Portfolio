import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, ProfileService } from '../core/services';
import { Profile } from '../core/models';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private profileService = inject(ProfileService);

  contactForm: FormGroup;
  profile: Profile | null = null;
  loading = false;
  profileLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.profileLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.profileLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: (response) => {
        this.successMessage = response.data.message;
        this.contactForm.reset();
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 429) {
          this.error = 'Too many requests. Please try again later.';
        } else if (err.status === 422) {
          this.error = 'Please check your input and try again.';
        } else {
          this.error = 'Failed to send message. Please try again later.';
        }
        this.loading = false;
        console.error('Error submitting contact form:', err);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return '';
  }
}

